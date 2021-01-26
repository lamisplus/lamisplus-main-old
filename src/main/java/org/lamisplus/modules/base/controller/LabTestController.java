package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.service.LabTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
@Slf4j
@RequiredArgsConstructor
@Audit
public class LabTestController {
    private final LabTestService labTestService;
    private final String ENTITY_NAME = "LabTest";

    @GetMapping
    @PreAuthorize("hasAuthority('laboratory_read')")
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return ResponseEntity.ok(this.labTestService.getAllLabTests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_read')")
    public ResponseEntity<LabTest> getLabTest(@PathVariable Long id) {
        return ResponseEntity.ok(labTestService.getLabTest(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('laboratory_write')")
    public ResponseEntity<LabTest> save(@RequestBody LabTest labTest) throws URISyntaxException {
        LabTest result = labTestService.save(labTest);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_write')")
    public ResponseEntity<LabTest> update(@PathVariable Long id, @RequestBody LabTest labTest) throws URISyntaxException {
        LabTest result = labTestService.update(id, labTest);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id)))
                .body(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory_delete')")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(this.labTestService.delete(id));
    }
}
