package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.JasperReportInfoMapper;
import org.lamisplus.modules.base.repository.JasperReportInfoRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.FileStorage;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class JasperReportService {
    private final JasperReportInfoRepository jasperReportInfoRepository;
    private final JasperReportInfoMapper jasperReportInfoMapper;
    private final ProgramRepository programRepository;

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
        Specification<JasperReportInfo> specification = genericSpecification.findAll();
        List<JasperReportInfo> jasperReportInfos = jasperReportInfoRepository.findAll(specification);

        List<JasperReportInfoDTO> jasperReportInfoDTOS = new ArrayList<>();
        jasperReportInfos.forEach(jasperReportInfo -> {
            final JasperReportInfoDTO jasperReportInfoDTO1 = jasperReportInfoMapper.toJasperReportInfoDTO(jasperReportInfo);
            Optional<Program>  program = this.programRepository.findProgramByUuid(jasperReportInfo.getProgramCode());
            program.ifPresent(value -> jasperReportInfoDTO1.setProgramName(value.getName()));
        });
        return jasperReportInfoDTOS;
    }

    public File generateReport(ReportDetailDTO reportDetailDTO) throws JRException, IOException, URISyntaxException {
        JasperReportInfo jasperReportInfo = getJasperReport(reportDetailDTO.getReportId());
        // Compile the Jasper report from .jrxml to .japser
        InputStream inputStream = new ByteArrayInputStream(jasperReportInfo.getTemplate().getBytes());
        final JasperReport report = JasperCompileManager.compileReport(inputStream);

/*
        String initialString = "text";
        InputStream targetStream = IOUtils.toInputStream(initialString);
*/

        // Fetching the data from the data source.
        final List<Object> data = new ArrayList<>();
        // TODO retrieve data from DataSourceProvider
        final JRBeanCollectionDataSource datasource = new JRBeanCollectionDataSource(data);

        // Adding the additional parameters to the report.
        final Map<String, Object> parameters = new HashMap<>();
        // TODO retrieve parameters from DataSourceProvider

        // Filling the report with the data and additional parameters information.
        final JasperPrint print = JasperFillManager.fillReport(report, parameters, datasource);

        // Export the report to a PDF file.
        String path = "";

        Path source = Paths.get(this.getClass().getResource("/").getPath());
        Path newFolder = Paths.get(source.toAbsolutePath() + "/newFolder/");
        System.out.println(newFolder);
        //Files.createDirectories(newFolder);

        JasperExportManager.exportReportToPdfFile(print, path + "report.pdf");
        FileStorage fileStorage = new FileStorage();
        return fileStorage.load1("report1.pdf");

    }
}
