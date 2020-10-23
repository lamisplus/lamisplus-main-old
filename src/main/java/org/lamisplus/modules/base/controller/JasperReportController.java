package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import net.sf.jasperreports.engine.JRException;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.entity.ReportDetailDTO;
import org.lamisplus.modules.base.report.JasperReportGenerator;
import org.lamisplus.modules.base.service.JasperReportInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/jasper-reports")
@Slf4j
@RequiredArgsConstructor
public class JasperReportController {
    private final JasperReportInfoService jasperReportInfoService;
    private final JasperReportGenerator jasperReportGenerator;
    private static final String ENTITY_NAME = "JasperReport";

    @PostMapping
    public ResponseEntity<JasperReportInfo> save(@RequestBody JasperReportInfoDTO jasperReportInfoDTO) throws URISyntaxException {
        System.out.println("Saving:"+jasperReportInfoDTO.getName());
        System.out.println("Id:"+jasperReportInfoDTO.getId());
        jasperReportInfoDTO.setId(0L);
        JasperReportInfo jasperReportInfo = this.jasperReportInfoService.save(jasperReportInfoDTO);
        return ResponseEntity.created(new URI("/api/jasper-reports/" + jasperReportInfo.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(jasperReportInfo.getId()))).body(jasperReportInfo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JasperReportInfo> update(@PathVariable Long id, @RequestBody JasperReportInfoDTO jasperReportInfoDTO) throws URISyntaxException {
        JasperReportInfo jasperReportInfo = this.jasperReportInfoService.update(id, jasperReportInfoDTO);
        return ResponseEntity.created(new URI("/api/jasper-reports/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id))).body(jasperReportInfo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.jasperReportInfoService.delete(id));
    }

    @GetMapping
    public ResponseEntity<List<JasperReportInfo>> getAllJasperReports() {
        return ResponseEntity.ok(this.jasperReportInfoService.getJasperReports());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<JasperReportInfo> getJasperReport(@PathVariable Long id) {
        return ResponseEntity.ok(this.jasperReportInfoService.getJasperReport(id));
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateReport(@RequestBody ReportDetailDTO reportDetailDTO) throws IOException, JRException {
        this.jasperReportGenerator.createReport(reportDetailDTO);
        return ResponseEntity.ok("OK");
    }

}
