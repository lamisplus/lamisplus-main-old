package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.LabTest;
import org.lamisplus.modules.base.base.service.LabTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
@Slf4j
@RequiredArgsConstructor
public class LabTestController {
    private final LabTestService labTestService;
    private final String ENTITY_NAME = "LabTest";

    @GetMapping
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return ResponseEntity.ok(this.labTestService.getAllLabTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTest> getLabTest(@PathVariable Long id) {
        return ResponseEntity.ok(labTestService.getLabTest(id));
    }

    @PostMapping
    public ResponseEntity<LabTest> save(@RequestBody LabTest labTest) throws URISyntaxException {
        LabTest result = labTestService.save(labTest);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTest> update(@PathVariable Long id, @RequestBody LabTest labTest) throws URISyntaxException {
        LabTest result = labTestService.update(id, labTest);
        return ResponseEntity.created(new URI("/api/lab-test-groups/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id)))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(this.labTestService.delete(id));
    }
}
