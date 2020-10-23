package org.lamisplus.modules.base.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.apache.commons.io.FileUtils;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.entity.ReportDetailDTO;
import org.lamisplus.modules.base.service.JasperReportInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class JasperReportGenerator {
    private final JasperReportInfoService jasperReportInfoService;

    public void createReport(ReportDetailDTO reportDetailDTO) throws JRException, IOException {
        JasperReportInfo jasperReportInfo = this.jasperReportInfoService.getJasperReport(reportDetailDTO.getReportId());
        // Fetching the .jrxml file from the resources folder.
        String template = jasperReportInfo.getTemplate();
        File destination = new File("./temp/");
        if (!destination.exists()) {
            destination.mkdirs();
            System.out.println("Dir created");
        }
        System.out.println(System.getProperty("user.dir"));

        String strClassPath = System.getProperty("java.class.path");

        System.out.println("Classpath is " + strClassPath);
/*
        FileUtils.writeStringToFile(new File("/temp/report.jrxml"), template, String.valueOf(StandardCharsets.UTF_8));
        final InputStream stream = this.getClass().getResourceAsStream("/templates/report.jrxml");

        // Compile the Jasper report from .jrxml to .japser
        final JasperReport report = JasperCompileManager.compileReport(stream);
*/

/*
        // Fetching the data from the data source.
        final List<Object>  data = new ArrayList<>();
        // TODO retrieve data from DataSourceProvider
        final JRBeanCollectionDataSource datasource = new JRBeanCollectionDataSource(data);

        // Adding the additional parameters to the report.
        final Map<String, Object> parameters = new HashMap<>();
        // TODO retrieve parameters from DataSourceProvider

        // Filling the report with the data and additional parameters information.
        final JasperPrint print = JasperFillManager.fillReport(report, parameters, datasource);

        // Users can change as per their project requirement  or can take it as request input requirement.
        // For simplicity, this tutorial will automatically place the file under the "c:" drive.
        // If users want to download the pdf file on the browser, then they need to use the "Content-Disposition" technique.
        final String filePath = "\\";
        // Export the report to a PDF file.
        JasperExportManager.exportReportToPdfFile(print, filePath + "report.pdf");
*/

    }

    private void makeDir(String directory) {
        File destination = new File(directory);
        if (!destination.exists()) {
            destination.mkdirs();
        }
    }
}
