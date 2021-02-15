package org.lamisplus.modules.base.controller;
import org.eclipse.birt.report.engine.api.EngineException;
import org.lamisplus.modules.base.birt.OutputType;
import org.lamisplus.modules.base.birt.engine.BirtReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;


@Controller
public class ReportController {
    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private BirtReportService reportService;

    @RequestMapping(method = RequestMethod.GET, value = "/report/{name}")
    @ResponseBody
    public void generateFullReport(HttpServletResponse response, HttpServletRequest request,
                                   @PathVariable("name") String name, @RequestParam("output") String output,
                                   @RequestParam Map<String,Object> searchParams) {
        log.info("Generating full report: " + name + "; format: " + output);
        OutputType format = OutputType.from(output);
        reportService.generateMainReport(name, format, searchParams, response, request);
    }
}
