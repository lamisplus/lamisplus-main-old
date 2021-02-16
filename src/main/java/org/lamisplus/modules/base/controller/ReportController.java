package org.lamisplus.modules.base.controller;
import org.eclipse.birt.report.engine.api.EngineException;
import org.lamisplus.modules.base.birt.OutputType;
import org.lamisplus.modules.base.birt.engine.BirtReportService;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.entity.ReportInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

@RestController
@RequestMapping("/api/reports")
@Controller
public class ReportController {
    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private BirtReportService reportService;

    @PostMapping
    public ResponseEntity<ReportInfo> save(@RequestBody ReportInfoDTO reportInfoDTO) throws URISyntaxException {
        reportInfoDTO.setId(0L);
        ReportInfo reportInfo = this.reportService.save(reportInfoDTO);
        return ResponseEntity.created(new URI("/api/reports/" + reportInfo.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(reportInfo.getId()))).body(reportInfo);
    }

    @PostMapping(value = "/generate")
    public void generateReport(@RequestBody ReportDetailDTO data, HttpServletResponse response, HttpServletRequest request) {
        log.info("Generating full report: " + data.getReportName() + "; format: " + data.getReportFormat());
        String reportFormat = data.getReportFormat().toLowerCase().trim();
        OutputType format = OutputType.from(reportFormat);
        reportService.generateReport(data, format, data.getParameters(), response, request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportInfo> update(@PathVariable Long id, @RequestBody ReportInfoDTO reportInfoDTO) throws URISyntaxException {
        ReportInfo reportInfo = this.reportService.update(id, reportInfoDTO);
        return ResponseEntity.created(new URI("/api/reports/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id))).body(reportInfo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.reportService.delete(id));
    }

    @GetMapping
    public ResponseEntity<List<ReportInfoDTO>> getAllJasperReports() {
        return ResponseEntity.ok(this.reportService.getReports());
    }
}
