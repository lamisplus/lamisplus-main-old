package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.domain.entity.LabTestGroup;
import org.lamisplus.modules.base.service.LabTestGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/lab-test-groups")
@Slf4j
@RequiredArgsConstructor
public class LabTestGroupController {
    private final LabTestGroupService labTestGroupService;
    private final String ENTITY_NAME = "LabTestGroup";

    @GetMapping
    public ResponseEntity<List<LabTestGroup>> getAllLabTestGroups() {
        return ResponseEntity.ok(this.labTestGroupService.getAllLabTestGroups());
    }
    @GetMapping("/{id}")
    public ResponseEntity<LabTestGroup> getLabTestGroup(@PathVariable Long id) {
        return ResponseEntity.ok(labTestGroupService.getLabTestGroup(id));
    }

    @GetMapping("/{id}/lab-tests")
    public ResponseEntity<List<LabTest>> getLabTestsByLabTestGroupId(@PathVariable Long id) {
        return ResponseEntity.ok(labTestGroupService.getLabTestsByLabTestGroupId(id));
    }

    @PostMapping
    public ResponseEntity<LabTestGroup> save(@RequestBody LabTestGroup labTestGroup) throws URISyntaxException {
        LabTestGroup result = labTestGroupService.save(labTestGroup);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTestGroup> update(@PathVariable Long id, @RequestBody LabTestGroup labTestGroup) throws URISyntaxException {
        LabTestGroup result = labTestGroupService.update(id, labTestGroup);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id)))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.labTestGroupService.delete(id));
    }
}
