package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.entity.RadiologyTest;
import org.lamisplus.modules.base.base.service.RadiologyTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/radiology-tests")
@Slf4j
@RequiredArgsConstructor
public class RadiologyTestController {

    private final RadiologyTestService radiologyTestService;

    @GetMapping
    public ResponseEntity<List<RadiologyTest>> getAllLabTestGroups() {
        return ResponseEntity.ok(this.radiologyTestService.getAllRadiologyTests());
    }
}
