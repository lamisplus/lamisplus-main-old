package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import org.apache.commons.io.IOUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;

import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.dto.PatientList;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.entity.Parameter;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.JasperReportInfoMapper;
import org.lamisplus.modules.base.repository.JasperReportInfoRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.DataSourceProvider;
import org.lamisplus.modules.base.util.FileStorage;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.RandomCodeGenerator;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class JasperReportService {
    private final JasperReportInfoRepository jasperReportInfoRepository;
    private final JasperReportInfoMapper jasperReportInfoMapper;
    private final ProgramRepository programRepository;
    private final DataSourceProvider dataSourceProvider;
    private final JdbcTemplate jdbcTemplate;

    public JasperReportInfo save(JasperReportInfoDTO jasperReportInfoDTO) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findByName(jasperReportInfoDTO.getName());
        if (optional.isPresent()) throw new RecordExistException(JasperReportInfo.class, "name", jasperReportInfoDTO.getName());
        JasperReportInfo jasperReportInfo = this.jasperReportInfoMapper.toJasperReportInfo(jasperReportInfoDTO);
        jasperReportInfo.setArchived(0);
        return jasperReportInfoRepository.save(jasperReportInfo);
    }

    public JasperReportInfo update(Long id, JasperReportInfoDTO jasperReportInfoDTO) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(JasperReportInfo.class, "Id", id +"");
        jasperReportInfoDTO.setId(id);

        JasperReportInfo jasperReportInfo = jasperReportInfoMapper.toJasperReportInfo(jasperReportInfoDTO);
        return jasperReportInfoRepository.save(jasperReportInfo);
    }

    public Integer delete(Long id) {
        Optional<JasperReportInfo> optional = jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(JasperReportInfo.class, "Id", id +"");
        optional.get().setArchived(1);
        return optional.get().getArchived();
    }

    public JasperReportInfo getJasperReport(Long id) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1) throw new EntityNotFoundException(JasperReportInfo.class, "Id", id+"");
        return optional.get();
    }

    public List<JasperReportInfoDTO> getJasperReports() {
        GenericSpecification<JasperReportInfo> genericSpecification = new GenericSpecification<JasperReportInfo>();
        Specification<JasperReportInfo> specification = genericSpecification.findAll(0);
        List<JasperReportInfo> jasperReportInfos = jasperReportInfoRepository.findAll(specification);

        List<JasperReportInfoDTO> jasperReportInfoDTOS = new ArrayList<>();
        jasperReportInfos.forEach(jasperReportInfo -> {
            final JasperReportInfoDTO jasperReportInfoDTO = jasperReportInfoMapper.toJasperReportInfoDTO(jasperReportInfo);
            Optional<Program>  program = this.programRepository.findProgramByCodeAndArchived(jasperReportInfoDTO.getProgramCode(), 0);
            program.ifPresent(value -> jasperReportInfoDTO.setProgramName(value.getName()));
            jasperReportInfoDTOS.add(jasperReportInfoDTO);
        });
        return jasperReportInfoDTOS;
    }

    public File generateReport(ReportDetailDTO reportDetailDTO) throws JRException, IOException, URISyntaxException, SQLException {
        JasperReportInfo jasperReportInfo = getJasperReport(reportDetailDTO.getReportId());
        // Compile the Jasper report from .jrxml to .japser
        //InputStream inputStream = new ByteArrayInputStream(jasperReportInfo.getTemplate().getBytes());
        //InputStream stream = this.getClass().getResourceAsStream("/report.jrxml");
        InputStream stream = IOUtils.toInputStream(jasperReportInfo.getTemplate());
        JasperReport report = JasperCompileManager.compileReport(stream);

        // Adding the additional parameters to the report.
        Map<String, Object> parameters = new HashMap<>();
        List<Parameter> parameterList = reportDetailDTO.getParameters();
        parameters = parameterList.stream().collect(Collectors.toMap(Parameter::getName, Parameter::getValue));

        // Fetching the data from the data source.
        //Filling the report with the data and additional parameters information.
        Connection connection = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection();

        JasperPrint print = null;
        if(jasperReportInfo.getDatasource().equals("None")) {
            print = JasperFillManager.fillReport(report, null, new JREmptyDataSource());
        } else {
            if(jasperReportInfo.getDatasource().equals("Embedded Query")) {
                print = JasperFillManager.fillReport(report, null, connection);
            } else {
                if(jasperReportInfo.getDatasource().equals("Patient Table")) {
                    List<PatientList> data = new ArrayList<>();
                    data = dataSourceProvider.patientList();
                    JRBeanCollectionDataSource datasource = new JRBeanCollectionDataSource(data);
                    print = JasperFillManager.fillReport(report, parameters, datasource);
                } else {
                    if(jasperReportInfo.getDatasource().equals("Indicator Table")) {

                    }
                }
            }
        }

        // Export the report to a PDF file.
        Path root = Paths.get(this.getClass().getResource("/").getPath());
        Path path = Paths.get(root.toAbsolutePath() + "/report/");
        Files.createDirectories(path);

        System.out.println("Report Type: "+reportDetailDTO.getReportType());
        String fileName = "";
        if(reportDetailDTO.getReportType().trim().toLowerCase().equals("html")) {
            fileName = exportHtml(print, path);
        }else {
            if(reportDetailDTO.getReportType().trim().toLowerCase().equals("excel")) {
                fileName = exportXls(print, path);
            }else {
                if(reportDetailDTO.getReportType().trim().toLowerCase().equals("csv")) {
                    fileName = exportCsv(print, path);
                }else {
                    fileName = exportPdf(print, path);
                }
            }
        }
        System.out.println("file created");
        FileStorage fileStorage = new FileStorage();
        Resource resource = fileStorage.load(fileName);
        return new File(String.valueOf(resource.getFile()));
    }

    private String exportPdf(JasperPrint print, Path path) throws JRException {
        String fileName = RandomCodeGenerator.randomAlphanumericString(7)+".pdf";
        JasperExportManager.exportReportToPdfFile(print, path+"/"+fileName);
        return fileName;
    }

    private String exportXls(JasperPrint print, Path path) throws JRException {
        String fileName = RandomCodeGenerator.randomAlphanumericString(7)+".xls";
        JRXlsxExporter exporter = new JRXlsxExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(new File(path+"/"+fileName)));

        // Set input and output ...
        SimpleXlsxReportConfiguration reportConfig = new SimpleXlsxReportConfiguration();
        reportConfig.setSheetNames(new String[] {"Report"});
        exporter.setConfiguration(reportConfig);
        exporter.exportReport();
        return fileName;
    }

    private  String exportCsv(JasperPrint print, Path path) throws JRException {
        String fileName = RandomCodeGenerator.randomAlphanumericString(7)+".csv";
        JRCsvExporter exporter = new JRCsvExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleWriterExporterOutput(new File(path+"/"+fileName)));
        exporter.exportReport();
        return fileName;
    }

    private String exportHtml(JasperPrint print, Path path) throws JRException {
        String fileName = RandomCodeGenerator.randomAlphanumericString(7)+".html";
        JasperExportManager.exportReportToHtmlFile(print, path+"/"+fileName);
        return fileName;
    }
}