package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.RadiologyDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/radiology-dashboard")
@Slf4j
@RequiredArgsConstructor
public class RadiologyDashboardController {
    private final RadiologyDashboardService radiologyDashboardService;


    @GetMapping("/{chartType}")
    public ResponseEntity<Object> generatePieChart(@PathVariable String chartType) {
        if (chartType.equalsIgnoreCase("pie")) {
            return ResponseEntity.ok(radiologyDashboardService.getRadiologyPieChart());
        }
        else throw new RuntimeException("Not found chartType should be pie");
    }

    @GetMapping("/{chartType}/{chartName}")
    public ResponseEntity<Object> generateColumnChart(@PathVariable String chartType, @PathVariable String chartName) {
        if (chartType.equalsIgnoreCase("column")) {
            if (chartName.equalsIgnoreCase("testOrders")) {
                return ResponseEntity.ok(radiologyDashboardService.getRadiologyTestOrderStackedColumnChart());
           }
            else throw new RuntimeException("Not found chartType");
        }
        else throw new RuntimeException("Not found");
    }
}