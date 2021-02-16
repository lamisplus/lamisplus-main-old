package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.domain.entity.LabTestGroup;
import org.lamisplus.modules.base.service.LabTestGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/lab-test-groups")
@Slf4j
@RequiredArgsConstructor
@Audit
public class LabTestGroupController {
    private final LabTestGroupService labTestGroupService;

    @GetMapping
    @PreAuthorize("hasAuthority('laboratory_read')")
    public ResponseEntity<List<LabTestGroup>> getAllLabTestGroups() {
        return ResponseEntity.ok(this.labTestGroupService.getAllLabTestGroups());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_read')")
    public ResponseEntity<LabTestGroup> getLabTestGroup(@PathVariable Long id) {
        return ResponseEntity.ok(labTestGroupService.getLabTestGroup(id));
    }

    @GetMapping("/{id}/lab-tests")
    @PreAuthorize("hasAuthority('laboratory_read')")
    public ResponseEntity<List<LabTest>> getLabTestsByLabTestGroupId(@PathVariable Long id) {
        return ResponseEntity.ok(labTestGroupService.getLabTestsByLabTestGroupId(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('laboratory_write')")
    public ResponseEntity<LabTestGroup> save(@RequestBody LabTestGroup labTestGroup) {
        return ResponseEntity.ok(labTestGroupService.save(labTestGroup));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_write')")
    public ResponseEntity<LabTestGroup> update(@PathVariable Long id, @RequestBody LabTestGroup labTestGroup) {
        return ResponseEntity.ok(labTestGroupService.update(id, labTestGroup));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_delete')")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.labTestGroupService.delete(id));
    }
}
