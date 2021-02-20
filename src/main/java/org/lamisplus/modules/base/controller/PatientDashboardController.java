package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.service.PatientDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient-dashboard")
@Slf4j
@RequiredArgsConstructor
@Audit
public class PatientDashboardController {
    private final PatientDashboardService patientDashboardService;


    @GetMapping("/{chartType}")
    public ResponseEntity<Object> generatePieChart(@PathVariable String chartType) {
        if(chartType.equalsIgnoreCase("pie")){
            return ResponseEntity.ok(patientDashboardService.getPieChart());
        } else if(chartType.equalsIgnoreCase("column")) {
            return ResponseEntity.ok(patientDashboardService.getColumnChart());
        }
        else throw new RuntimeException("Not found chartType should be either pie or column");
    }

    @GetMapping("/{chartType}/{chartName}")
    public ResponseEntity<Object> generateColumnChart(@PathVariable String chartType, @PathVariable String chartName) {
        if (chartType.equalsIgnoreCase("column")) {
            if (chartName.equalsIgnoreCase("deathRate")) {
                return ResponseEntity.ok(patientDashboardService.getDeathRateColumnChart());
            } else if (chartName.equalsIgnoreCase("birthRate")) {
                return ResponseEntity.ok(patientDashboardService.getBirthRateColumnChart());
            } else throw new RuntimeException("Not found");
        } else throw new RuntimeException("Not found");
    }
}