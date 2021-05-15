package org.lamisplus.modules.base.service.report.birt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.eclipse.birt.core.exception.BirtException;
import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.*;
import org.eclipse.birt.report.model.api.*;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.config.DatabaseProperties;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ReportDetailDTO;
import org.lamisplus.modules.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.mapper.ReportInfoMapper;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.repository.ReportInfoRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.time.LocalDate;
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
        InputStream stream = IOUtils.toInputStream(reportInfo.getTemplate());
        User user;
        Optional<User> optionalUser = SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithRoleByUserName);
        if(optionalUser.isPresent()){
            user = optionalUser.get();
            if(params.get("facility_Id") == null){
                //assign default facilityId
                params.put("facility_Id", user.getCurrentOrganisationUnitId());

            } else {
                //check facilityId belongs to user
                List <Long> orgUnits = user.getApplicationUserOrganisationUnits().stream().map(ApplicationUserOrganisationUnit::getOrganisationUnitId).collect(Collectors.toList());
                if(!orgUnits.contains(Long.valueOf((Integer)params.get("facility_Id")))){
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
                generateHTMLReport(reportInfo.getName(),reports.get(reportInfo.getName()), params, response, request);
                break;
            case PDF:
                generatePDFReport(reportInfo.getName(), reports.get(reportInfo.getName()), params, response, request);
                break;
            case CSV:
                generateExcelReport(reportInfo.getName(),reports.get(reportInfo.getName()), params, response, request);
                break;
            case EXCEL:
                generateExcelReport(reportInfo.getName(),reports.get(reportInfo.getName()), params, response, request);
                break;
            default:
                throw new IllegalArgumentException("Output type not recognized:" + output);
        }

    }

    /**
     * Generate a report as HTML
     */
    @SuppressWarnings("unchecked")
    private void generateHTMLReport(String reportName, IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        getDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("html"));
        IRenderOption options = new RenderOption();
        HTMLRenderOption htmlOptions = new HTMLRenderOption(options);
        htmlOptions.setOutputFormat("html");
        runAndRenderTask.setRenderOption(htmlOptions);
        runAndRenderTask.getAppContext().put("HTML_RENDER_CONTEXT", request);


        try {
            response.setHeader("Content-Disposition", "attachment; filename=\"" + reportName.replace(" ","_")+ LocalDate.now().toString().replace("-", "") + "\"");
            htmlOptions.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            runAndRenderTask.close();
        }
    }

    /**
     * Generate a report as PDF
     */
    @SuppressWarnings("unchecked")
    private void generatePDFReport(String reportName, IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        getDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = this.birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(this.birtEngine.getMIMEType("pdf"));
        IRenderOption options = new RenderOption();
        PDFRenderOption pdfRenderOption = new PDFRenderOption(options);
        pdfRenderOption.setOutputFormat("pdf");
        runAndRenderTask.setRenderOption(pdfRenderOption);
        runAndRenderTask.getAppContext().put("PDF_RENDER_CONTEXT", request);

        try {
            response.setHeader("Content-Disposition", "attachment; filename=\"" + reportName.replace(" ","_")+ LocalDate.now().toString().replace("-", "") + "\"");
            pdfRenderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            runAndRenderTask.close();
        }

    }

    /**
     * Generate a report as Excel
     */
    @SuppressWarnings("unchecked")
    private void generateExcelReport(String reportName, IReportRunnable report, Map<String,Object> params, HttpServletResponse response, HttpServletRequest request) {
        getDatabaseConnectionParameters(report);
        IRunAndRenderTask runAndRenderTask = birtEngine.createRunAndRenderTask(report);
        runAndRenderTask.setParameterValues(params);
        response.setContentType(birtEngine.getMIMEType("xls"));
        IRenderOption options = new RenderOption();
        /*String WORKSPACE_DIR = System.getProperty("user.dir");
        new File( WORKSPACE_DIR ).mkdir( );
        options.setOutputFileName("report.xls"); //$NON-NLS-1$*/
        options.setOutputFormat("xls");

        EXCELRenderOption excelRenderOption = new EXCELRenderOption(options);
        excelRenderOption.setOutputFormat("xls");
        runAndRenderTask.setRenderOption(excelRenderOption);
        runAndRenderTask.getAppContext().put("HTML_RENDER_CONTEXT", request);


        try {
            response.setHeader("Content-Disposition", "attachment; filename=\"" + reportName.replace(" ","_")+ LocalDate.now().toString().replace("-", "") + "\".xls");
            response.setContentType(".xls");
            excelRenderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            runAndRenderTask.close();
        }
    }

    /*private void customRunAndRenderTask(RenderOption renderOption, IRunAndRenderTask runAndRenderTask, HttpServletResponse response){
        try {
            renderOption.setOutputStream(response.getOutputStream());
            runAndRenderTask.run();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            runAndRenderTask.close();
        }
    }*/

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
        ReportInfo reportInfo = reportInfoRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(()
                -> new EntityNotFoundException(ReportInfo.class, "Id", id +""));
        reportInfo.setArchived(ARCHIVED);
        reportInfoRepository.save(reportInfo);
        return reportInfo.getArchived();
    }

    public List<ReportInfoDTO> getReports() {
        List<ReportInfo> reportInfos = reportInfoRepository.findAllByArchived(UN_ARCHIVED);

        List<ReportInfoDTO> reportInfoDTOS = new ArrayList<>();
        reportInfos.forEach(reportInfo -> {
            final ReportInfoDTO reportInfoDTO = reportInfoMapper. mapWithoutTemplate(reportInfo);
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

    private String dbUrl;

    private String dbUser;

    private String dbPass;

    private void getDatabaseConnectionParameters( IReportRunnable iReportRunnable ) {
        String fileSeparator = File.separator;
        File ymlFile = new File(ApplicationProperties.modulePath + fileSeparator +"config.yml");
        try {
            readYml(ymlFile).getSpring().forEach((k, v) -> {
                dbUrl = v.getUrl();
                dbUser = v.getUsername();
                dbPass = v.getPassword();
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
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

    private DatabaseProperties readYml(File ymlFile) throws IOException {
        BufferedReader in = null;
        DatabaseProperties databaseProperties;
        try {
            in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(ymlFile.getAbsolutePath())));
            Yaml yaml = new Yaml();
            databaseProperties = yaml.loadAs(in, DatabaseProperties.class);

            in.close();
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }finally {
            if (in != null) {in.close(); }
        }
        return databaseProperties;
    }
}