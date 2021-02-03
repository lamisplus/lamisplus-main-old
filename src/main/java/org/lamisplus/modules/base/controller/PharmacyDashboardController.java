package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.service.PharmacyDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pharmacy-dashboard")
@Slf4j
@RequiredArgsConstructor
@Audit
public class PharmacyDashboardController {
    private final PharmacyDashboardService pharmacyDashboardService;


    @GetMapping("/{chartType}")
    public ResponseEntity<Object> generatePieChart(@PathVariable String chartType) {
        if(chartType.equalsIgnoreCase("pie")) {
            return ResponseEntity.ok(pharmacyDashboardService.getPharmacyPieChart());
        }else if (chartType.equalsIgnoreCase("column")) {
            return ResponseEntity.ok(pharmacyDashboardService.getPharmacyColumnChart());
        }
        else throw new RuntimeException("Not found");
    }
}