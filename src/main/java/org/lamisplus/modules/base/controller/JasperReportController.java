package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import net.sf.jasperreports.engine.JRException;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.DataSourceDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.service.JasperReportService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/jasper-reports")
@Slf4j
@RequiredArgsConstructor
@Audit
public class JasperReportController {
    private final JasperReportService jasperReportService;
    private static final String ENTITY_NAME = "JasperReport";

    @PostMapping
    public ResponseEntity<JasperReportInfo> save(@RequestBody JasperReportInfoDTO jasperReportInfoDTO) throws URISyntaxException {
        System.out.println("Saving:"+jasperReportInfoDTO.getName());
        System.out.println("Id:"+jasperReportInfoDTO.getId());
        jasperReportInfoDTO.setId(0L);
        JasperReportInfo jasperReportInfo = this.jasperReportService.save(jasperReportInfoDTO);
        return ResponseEntity.created(new URI("/api/jasper-reports/" + jasperReportInfo.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(jasperReportInfo.getId()))).body(jasperReportInfo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JasperReportInfo> update(@PathVariable Long id, @RequestBody JasperReportInfoDTO jasperReportInfoDTO) throws URISyntaxException {
        JasperReportInfo jasperReportInfo = this.jasperReportService.update(id, jasperReportInfoDTO);
        return ResponseEntity.created(new URI("/api/jasper-reports/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id))).body(jasperReportInfo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.jasperReportService.delete(id));
    }

    @GetMapping
    public ResponseEntity<List<JasperReportInfoDTO>> getAllJasperReports() {
        return ResponseEntity.ok(this.jasperReportService.getJasperReports());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<JasperReportInfo> getJasperReport(@PathVariable Long id) {
        return ResponseEntity.ok(this.jasperReportService.getJasperReport(id));
    }

    @PostMapping("/generate")
    public HttpEntity<byte[]> generateReport(@RequestBody ReportDetailDTO data, HttpServletResponse response) throws IOException, JRException, URISyntaxException, SQLException {
        File file = this.jasperReportService.generateReport(data);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());

/*
        byte[] b = Files.readAllBytes(file.toPath());
        System.out.println(b);
        new FileStorage().writeBytesToFile(b, "/temp.pdf");
*/
        return new HttpEntity<>(Files.readAllBytes(file.toPath()), headers);
    }

}