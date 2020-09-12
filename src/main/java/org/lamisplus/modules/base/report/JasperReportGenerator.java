package org.lamisplus.modules.base.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRSaver;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.entity.ReportDetailDTO;
import org.lamisplus.modules.base.service.JasperReportService;
import org.lamisplus.modules.base.util.FileStorage;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class JasperReportGenerator {
    private final JasperReportService jasperReportService;
    private static String templatePath = "src/main/resources/report/";

    public File createReport(ReportDetailDTO reportDetailDTO) throws JRException, IOException, URISyntaxException {
        JasperReportInfo jasperReportInfo = this.jasperReportService.getJasperReport(reportDetailDTO.getReportId());
        // Fetching the .jrxml file from the resources folder.
        /*String templateName = "art_summary"; //jasperReportInfo.getName();

        String jrxml = templatePath+templateName+".jrxml";

        FileInputStream jrxmlStream = new FileInputStream(jrxml);
        System.out.println("Template path: "+jrxmlStream);

        // Compile the Jasper report from .jrxml to .japser
        final JasperReport report = JasperCompileManager.compileReport(jrxmlStream);
        String jasper = templatePath+templateName+".jasper";
        JRSaver.saveObject(report, jasper);

        // Fetching the data from the data source.
        final List<Object> data = new ArrayList<>();
        // TODO retrieve data from DataSourceProvider
        final JRBeanCollectionDataSource datasource = new JRBeanCollectionDataSource(data);

        // Adding the additional parameters to the report.
        final Map<String, Object> parameters = new HashMap<>();
        // TODO retrieve parameters from DataSourceProvider

        // Filling the report with the data and additional parameters information.
        final JasperPrint print = JasperFillManager.fillReport(report, parameters, datasource);
*/
        // Users can change as per their project requirement  or can take it as request input requirement.
        // For simplicity, this tutorial will automatically place the file under the "c:" drive.
        // If users want to download the pdf file on the browser, then they need to use the "Content-Disposition" technique.
        // Export the report to a PDF file.
        //JasperExportManager.exportReportToPdfFile(print, templatePath + "report.pdf");
        FileStorage fileStorage = new FileStorage();
        return fileStorage.load1("report1.pdf");

    }

}
