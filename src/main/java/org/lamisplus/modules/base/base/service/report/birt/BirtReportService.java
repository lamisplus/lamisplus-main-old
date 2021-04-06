package org.lamisplus.modules.base.base.service.report.birt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.data.oda.jdbc.OdaJdbcDriver;
import org.eclipse.birt.report.engine.api.*;
import org.eclipse.birt.report.model.api.*;
import org.hibernate.engine.config.spi.ConfigurationService;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.base.domain.entity.*;
import org.lamisplus.modules.base.base.domain.mapper.ReportInfoMapper;
import org.lamisplus.modules.base.base.repository.ProgramRepository;
import org.lamisplus.modules.base.base.repository.ReportInfoRepository;
import org.lamisplus.modules.base.base.repository.UserRepository;
import org.lamisplus.modules.base.base.security.SecurityUtils;
import org.lamisplus.modules.base.base.util.GenericSpecification;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BirtReportService implements ApplicationContextAware, DisposableBean{
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private final UserRepository userRepository;
    private static String name;

    /*@Value("${reports.relative.path}")
    private String reportsPath = System.getProperty("user.dir");
    @Value("${images.relative.path}")
    private String imagesPath;

    private HTMLServerImageHandler htmlImageHandler = new HTMLServerImageHandler();
*/
    private IReportEngine birtEngine;
    private ApplicationContext context;
    //private String imageFolder;
    
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
        //imageFolder = System.getProperty("user.dir") + File.separatorChar + reportsPath + imagesPath;
        //loadReports();
    }

    @Override
    public void setApplicationContext(ApplicationContext context) {
        this.context = context;
    }

    /**
     * Load report files to memory
     *
     */
    /*public void loadReports() throws EngineException {
        File folder = new File(reportsPath);
        if(folder.exists() || folder.list().length > 0) {
            for (String file : Objects.requireNonNull(folder.list())) {
                if (!file.endsWith(".rptdesign")) {
                    continue;
                }
                reports.put(file.replace(".rptdesign", ""),
                        birtEngine.openReportDesign(folder.getAbsolutePath() + File.separator + file));
            }
        }

    }*/

    public void loadReports(String reportName, InputStream reportStream) throws EngineException {
        reports.put(reportName, birtEngine.openReportDesign(reportStream));

    }


    public void generateReport(ReportDetailDTO reportDetailDTO, OutputType output, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        ReportInfo reportInfo = getReport(reportDetailDTO.getReportId());
        name = reportInfo.getName();
        log.info("Info {}", reportInfo);
        log.info("name ", reportInfo.getName());

        InputStream stream = IOUtils.toInputStream(reportInfo.getTemplate());
        User user;
        Optional<User> optionalUser = SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithRoleByUserName);
        if(optionalUser.isPresent()){
            user = optionalUser.get();
            if(params.get("facilityId") == null){
                //assign default facilityId
                params.put("facilityId", user.getCurrentOrganisationUnitId());

            } else {
                //check facilityId belongs to user
                List <Long> orgUnits = user.getApplicationUserOrganisationUnits().stream().map(ApplicationUserOrganisationUnit::getOrganisationUnitId).collect(Collectors.toList());
                if(!orgUnits.contains(Long.valueOf((Integer)params.get("facilityId")))){
                    throw new EntityNotFoundException(OrganisationUnit.class,"FacilityId","User not in Organisation Unit");
                }
            }
        }

        try {
            loadReports(reportInfo.getName(), stream);
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
        populateDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("html"));
        IRenderOption options = new RenderOption();
        HTMLRenderOption htmlOptions = new HTMLRenderOption(options);
        htmlOptions.setOutputFormat("html");
        htmlOptions.setOutputFileName(name+".html");
        log.info("birt report name is", name+".html");
        //htmlOptions.setBaseImageURL("/" + reportsPath + imagesPath);
        //htmlOptions.setImageDirectory(imageFolder);
        //htmlOptions.setImageHandler(htmlImageHandler);
        runAndRenderTask.setRenderOption(htmlOptions);

        runAndRenderTask.setRenderOption(htmlOptions);

        customRunAndRenderTask(htmlOptions, runAndRenderTask, response);
        }

    /**
     * Generate a report as PDF
     */
    @SuppressWarnings("unchecked")
    private void generatePDFReport(IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        populateDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);

        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("pdf"));
        IRenderOption options = new RenderOption();
        PDFRenderOption pdfRenderOption = new PDFRenderOption(options);
        pdfRenderOption.setOutputFormat("pdf");
        pdfRenderOption.setOutputFileName(name+".pdf");
        log.info("birt report name is", name+".pdf");

        runAndRenderTask.setRenderOption(pdfRenderOption);
        runAndRenderTask.getAppContext().put(EngineConstants.APPCONTEXT_PDF_RENDER_CONTEXT, request);

        try {
            response.setHeader("Content-Disposition", "attachment; filename=\"" + name + "\"");
            pdfRenderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            runAndRenderTask.close();
            destroy();
        }
    }

    /**
     * Generate a report as Excel
     */
    @SuppressWarnings("unchecked")
    private void generateExcelReport(IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        populateDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("xlsx"));
        IRenderOption options = new RenderOption();

        EXCELRenderOption excelRenderOption = new EXCELRenderOption(options);
        excelRenderOption.setOutputFormat("xlsx");
        excelRenderOption.setOutputFileName(name+".xlsx");
        log.info("birt report name is", name+".xlsx");

        runAndRenderTask.setRenderOption(excelRenderOption);
        runAndRenderTask.getAppContext().put(EngineConstants.APPCONTEXT_BIRT_VIEWER_HTTPSERVET_REQUEST, request);

        customRunAndRenderTask(excelRenderOption, runAndRenderTask, response);
    }

    private void customRunAndRenderTask(RenderOption renderOption, IRunAndRenderTask runAndRenderTask, HttpServletResponse response){

        try {
            renderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            runAndRenderTask.close();
            destroy();
        }
    }

    @Override
    public void destroy() {
        birtEngine.destroy();
        Platform.shutdown();
    }

    public ReportInfo save(ReportInfoDTO reportInfoDTO) {
        Optional<ReportInfo> optional = this.reportInfoRepository.findByNameAndArchived(reportInfoDTO.getName(), UN_ARCHIVED);
        if (optional.isPresent()) throw new RecordExistException(ReportInfo.class, "name", reportInfoDTO.getName());
        ReportInfo reportInfo = this.reportInfoMapper.toReportInfo(reportInfoDTO);
        reportInfo.setArchived(UN_ARCHIVED);
        return reportInfoRepository.save(reportInfo);
    }

    public ReportInfo update(Long id, ReportInfoDTO reportInfoDTO) {
        Optional<ReportInfo> optional = this.reportInfoRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!optional.isPresent())throw new EntityNotFoundException(ReportInfo.class, "Id", id +"");
        reportInfoDTO.setId(id);

        ReportInfo reportInfo = reportInfoMapper.toReportInfo(reportInfoDTO);
        reportInfo.setArchived(UN_ARCHIVED);
        return reportInfoRepository.save(reportInfo);
    }


    public Integer delete(Long id) {
        Optional<ReportInfo> optional = reportInfoRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!optional.isPresent())throw new EntityNotFoundException(ReportInfo.class, "Id", id +"");
        optional.get().setArchived(ARCHIVED);
        return optional.get().getArchived();
    }

    public List<ReportInfoDTO> getReports() {
        List<ReportInfo> reportInfos = reportInfoRepository.findAllByArchived(UN_ARCHIVED);

        List<ReportInfoDTO> reportInfoDTOS = new ArrayList<>();
        reportInfos.forEach(reportInfo -> {
            final ReportInfoDTO reportInfoDTO = reportInfoMapper.toReportInfoDTO(reportInfo);
            Optional<Program>  program = this.programRepository.findProgramByCodeAndArchived(reportInfoDTO.getProgramCode(), UN_ARCHIVED);
            program.ifPresent(value -> reportInfoDTO.setProgramName(value.getName()));
            reportInfoDTOS.add(reportInfoDTO);
        });
        return reportInfoDTOS;
    }

    public ReportInfo getReport(Long id) {
        return reportInfoRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() ->
                new EntityNotFoundException(ReportInfo.class, "Id", id+""));
    }

    private void populateDatabaseConnectionParameters( IReportRunnable iReportRunnable ) {

        String dbUrl = "jdbc:postgresql://localhost:5432/lamisplus_db_bk_30_03_21"; //You decide how to get this
        String dbUser = "postgres"; //You decide how to get this
        String dbPass = "emeka"; //You decide how to get this


        DesignElementHandle deh = iReportRunnable.getDesignHandle();
        SlotHandle slotHandle = deh.getSlot(ReportDesignHandle.DATA_SOURCE_SLOT );
        Iterator iter = slotHandle.iterator();

        try
        {
            while( iter.hasNext() )
            {
                Object obj = iter.next();
                OdaDataSourceHandle odaSrcHdl = (OdaDataSourceHandle) obj;
                Iterator propIter = odaSrcHdl.getPropertyIterator();

                while( propIter.hasNext() )
                {
                    PropertyHandle propHdl = (PropertyHandle) propIter.next();

                    if( propHdl.getPropertyDefn().getName().equalsIgnoreCase(
                            "odaURL" ) )
                    {
                        propHdl.setStringValue( dbUrl );
                    }
                    else if( propHdl.getPropertyDefn().getName().equalsIgnoreCase(
                            "odaUser" ) )
                    {
                        propHdl.setStringValue( dbUser );
                    }
                    else if( propHdl.getPropertyDefn().getName().equalsIgnoreCase(
                            "odaPassword" ) )
                    {
                        propHdl.setStringValue( dbPass );
                    }
                }
            }
        }
        catch( Exception e )
        {
            e.printStackTrace();
        }
    }
}
