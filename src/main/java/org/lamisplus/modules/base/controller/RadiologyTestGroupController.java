package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.entity.RadiologyTest;
import org.lamisplus.modules.base.domain.entity.RadiologyTestGroup;
import org.lamisplus.modules.base.service.RadiologyTestGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/radiology-test-groups")
@Slf4j
@RequiredArgsConstructor
@Audit
public class RadiologyTestGroupController {
    private final RadiologyTestGroupService radiologyTestGroupService;

    @GetMapping
    public ResponseEntity<List<RadiologyTestGroup>> getAllRadiologyTestGroups() {
        return ResponseEntity.ok(this.radiologyTestGroupService.getAllRadiologyTestGroups());
    }

    @GetMapping("/radiology-tests/{groupId}")
    public ResponseEntity<List<RadiologyTest>> getRadiologyTestsByGroupId(@PathVariable Long groupId) {
        return ResponseEntity.ok(this.radiologyTestGroupService.getRadiologyTestByGroupId(groupId));
    }

}
