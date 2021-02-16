package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.service.LaboratoryDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/laboratory-dashboard")
@Slf4j
@RequiredArgsConstructor
@Audit
public class LaboratoryDashboardController {
    private final LaboratoryDashboardService laboratoryDashboardService;


    @GetMapping("/{chartType}")
    public ResponseEntity<Object> generatePieChart(@PathVariable String chartType) {
        if (chartType.equalsIgnoreCase("pie")) {
            return ResponseEntity.ok(laboratoryDashboardService.getLaboratoryPieChart());
        }
        else throw new RuntimeException("Not found chartType should be pie");
    }

    @GetMapping("/{chartType}/{chartName}")
    public ResponseEntity<Object> generateColumnChart(@PathVariable String chartType, @PathVariable String chartName) {
        if (chartType.equalsIgnoreCase("column")) {
            if (chartName.equalsIgnoreCase("testOrders")) {
                return ResponseEntity.ok(laboratoryDashboardService.getLaboratoryTestOrderStackedColumnChart());
            }else if (chartName.equalsIgnoreCase("lims")) {
                return ResponseEntity.ok(laboratoryDashboardService.getLimsColumnChart());
            }
            else throw new RuntimeException("Not found chartType must be either testOrders or lims ");
        }
        else throw new RuntimeException("Not found");
    }
}