package org.lamisplus.modules.base.controller;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.service.report.birt.OutputType;
import org.lamisplus.modules.base.service.report.birt.BirtReportService;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.ReportInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Controller
@RequiredArgsConstructor
public class ReportController {
    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    private final BirtReportService reportService;

    @PostMapping
    public ResponseEntity<ReportInfo> save(@RequestBody ReportInfoDTO reportInfoDTO) {
        reportInfoDTO.setId(0L);
        return ResponseEntity.ok(this.reportService.save(reportInfoDTO));
    }

    @PostMapping(value = "/generate")
    public void generateReport(@RequestBody ReportDetailDTO data, HttpServletResponse response, HttpServletRequest request) {
        log.info("Generating full report: " + data.getReportName() + "; format: " + data.getReportFormat());
        String reportFormat = data.getReportFormat().toLowerCase().trim();
        OutputType format = OutputType.from(reportFormat);

        reportService.generateReport(data, format, data.getParameters(), response, request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportInfo> update(@PathVariable Long id, @RequestBody ReportInfoDTO reportInfoDTO) {
        return ResponseEntity.ok(this.reportService.update(id, reportInfoDTO));
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
