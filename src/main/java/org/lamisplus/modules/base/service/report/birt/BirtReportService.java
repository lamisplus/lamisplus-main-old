package org.lamisplus.modules.base.service.report.birt;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.ReportInfo;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.ReportInfoMapper;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.repository.ReportInfoRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BirtReportService implements ApplicationContextAware, DisposableBean{
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    @Value("${reports.relative.path}")
    private String reportsPath;
    @Value("${images.relative.path}")
    private String imagesPath;

    private HTMLServerImageHandler htmlImageHandler = new HTMLServerImageHandler();

    private final ResourceLoader resourceLoader;
    private final ServletContext servletContext;

    private IReportEngine birtEngine;
    private ApplicationContext context;
    private String imageFolder;
    
    private final ReportInfoRepository reportInfoRepository;
    
    private final ReportInfoMapper reportInfoMapper;

    private final ProgramRepository programRepository;

    private Map<String, IReportRunnable> reports = new HashMap<>();

    @SuppressWarnings("unchecked")
    @PostConstruct
    protected void initialize() throws BirtException {
        EngineConfig config = new EngineConfig();
        config.getAppContext().put("spring", this.context);
        Platform.startup(config);
        IReportEngineFactory factory = (IReportEngineFactory) Platform
                .createFactoryObject(IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY);
        birtEngine = factory.createReportEngine(config);
        imageFolder = System.getProperty("user.dir") + File.separatorChar + reportsPath + imagesPath;
        loadReports();
    }

    @Override
    public void setApplicationContext(ApplicationContext context) {
        this.context = context;
    }

    /**
     * Load report files to memory
     *
     */
    public void loadReports() throws EngineException {
        File folder = new File(reportsPath);
        if(folder.list().length > 0) {
            for (String file : Objects.requireNonNull(folder.list())) {
                if (!file.endsWith(".rptdesign")) {
                    continue;
                }
                reports.put(file.replace(".rptdesign", ""),
                        birtEngine.openReportDesign(folder.getAbsolutePath() + File.separator + file));
            }
        }

    }

    public void loadReports(String reportName, InputStream reportStream) throws EngineException {
        reports.put(reportName, birtEngine.openReportDesign(reportStream));

    }

//    public List<Report> getReports() {
//        List<Report> response = new ArrayList<>();
//        for (Map.Entry<String, IReportRunnable> entry : reports.entrySet()) {
//            IReportRunnable report = reports.get(entry.getKey());
//            IGetParameterDefinitionTask task = birtEngine.createGetParameterDefinitionTask(report);
//            Report reportItem = new Report(report.getDesignHandle().getProperty("title").toString(), entry.getKey());
//            for (Object h : task.getParameterDefns(false)) {
//                IParameterDefn def = (IParameterDefn) h;
//                reportItem.getParameters()
//                        .add(new Report.Parameter(def.getPromptText(), def.getName(), getParameterType(def)));
//            }
//            response.add(reportItem);
//        }
//        return response;
//    }
//
//    private Report.ParameterType getParameterType(IParameterDefn param) {
//        if (IParameterDefn.TYPE_INTEGER == param.getDataType()) {
//            return Report.ParameterType.INT;
//        }
//        return Report.ParameterType.STRING;
//    }

    public void generateReport(ReportDetailDTO reportDetailDTO, OutputType output, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        ReportInfo reportInfo = getReport(reportDetailDTO.getReportId());
        InputStream stream = IOUtils.toInputStream(reportInfo.getTemplate());
        try {
            loadReports(reportDetailDTO.getReportName(), stream);
        } catch (EngineException e) {
            e.printStackTrace();
        }

        switch (output) {
            case HTML:
                generateHTMLReport(reports.get(reportInfo.getName()), params, response, request);
                break;
            case PDF:
                generatePDFReport(reports.get(reportInfo.getName()), params, response, request);
                break;
            case EXCEL:
                generateExcelReport(reports.get(reportInfo.getName()), params, response, request);
                break;
            default:
                throw new IllegalArgumentException("Output type not recognized:" + output);
        }
    }

    /**
     * Generate a report as HTML
     */
    @SuppressWarnings("unchecked")
    private void generateHTMLReport(IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("html"));
        IRenderOption options = new RenderOption();
        HTMLRenderOption htmlOptions = new HTMLRenderOption(options);
        htmlOptions.setOutputFormat("html");
        htmlOptions.setBaseImageURL("/" + reportsPath + imagesPath);
        htmlOptions.setImageDirectory(imageFolder);
        htmlOptions.setImageHandler(htmlImageHandler);
        runAndRenderTask.setRenderOption(htmlOptions);
        runAndRenderTask(htmlOptions, runAndRenderTask, response, request);
        }

    /**
     * Generate a report as PDF
     */
    @SuppressWarnings("unchecked")
    private void generatePDFReport(IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);

        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("pdf"));
        IRenderOption options = new RenderOption();
        PDFRenderOption pdfRenderOption = new PDFRenderOption(options);
        pdfRenderOption.setOutputFormat("pdf");
        runAndRenderTask.setRenderOption(pdfRenderOption);
        runAndRenderTask.getAppContext().put(EngineConstants.APPCONTEXT_PDF_RENDER_CONTEXT, request);

        try {
            pdfRenderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            runAndRenderTask.close();
        }
    }

    /**
     * Generate a report as Excel
     */
    @SuppressWarnings("unchecked")
    private void generateExcelReport(IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("xlsx"));
        IRenderOption options = new RenderOption();

        EXCELRenderOption excelRenderOption = new EXCELRenderOption(options);
        excelRenderOption.setOutputFormat("xlsx");

        runAndRenderTask(excelRenderOption, runAndRenderTask, response, request);
    }

    private void runAndRenderTask(RenderOption renderOption, IRunAndRenderTask runAndRenderTask, HttpServletResponse response, HttpServletRequest request){
        runAndRenderTask.setRenderOption(renderOption);
        runAndRenderTask.getAppContext().put(EngineConstants.APPCONTEXT_BIRT_VIEWER_HTTPSERVET_REQUEST, request);

        try {
            renderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            runAndRenderTask.close();
        }
    }

    @Override
    public void destroy() {
        birtEngine.destroy();
        Platform.shutdown();
    }

    public ReportInfo save(ReportInfoDTO reportInfoDTO) {
        Optional<ReportInfo> optional = this.reportInfoRepository.findByName(reportInfoDTO.getName());
        if (optional.isPresent()) throw new RecordExistException(ReportInfo.class, "name", reportInfoDTO.getName());
        ReportInfo reportInfo = this.reportInfoMapper.toReportInfo(reportInfoDTO);
        reportInfo.setArchived(UN_ARCHIVED);
        return reportInfoRepository.save(reportInfo);
    }

    public ReportInfo update(Long id, ReportInfoDTO reportInfoDTO) {
        Optional<ReportInfo> optional = this.reportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == ARCHIVED)throw new EntityNotFoundException(ReportInfo.class, "Id", id +"");
        reportInfoDTO.setId(id);

        ReportInfo jasperReportInfo = reportInfoMapper.toReportInfo(reportInfoDTO);
        return reportInfoRepository.save(jasperReportInfo);
    }


    public Integer delete(Long id) {
        Optional<ReportInfo> optional = reportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == ARCHIVED)throw new EntityNotFoundException(ReportInfo.class, "Id", id +"");
        optional.get().setArchived(ARCHIVED);
        return optional.get().getArchived();
    }

    public List<ReportInfoDTO> getReports() {
        GenericSpecification<ReportInfo> genericSpecification = new GenericSpecification<ReportInfo>();
        Specification<ReportInfo> specification = genericSpecification.findAll(0);
        List<ReportInfo> reportInfos = reportInfoRepository.findAll(specification);

        List<ReportInfoDTO> reportInfoDTOS = new ArrayList<>();
        reportInfos.forEach(reportInfo -> {
            final ReportInfoDTO reportInfoDTO = reportInfoMapper.toReportInfoDTO(reportInfo);
            Optional<Program>  program = this.programRepository.findProgramByCodeAndArchived(reportInfoDTO.getProgramCode(), 0);
            program.ifPresent(value -> reportInfoDTO.setProgramName(value.getName()));
            reportInfoDTOS.add(reportInfoDTO);
        });
        return reportInfoDTOS;
    }

    public ReportInfo getReport(Long id) {
        Optional<ReportInfo> optional = this.reportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == ARCHIVED) throw new EntityNotFoundException(ReportInfo.class, "Id", id+"");
        return optional.get();
    }

}
