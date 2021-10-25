package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.service.LabTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
@Slf4j
@RequiredArgsConstructor
public class LabTestController {
    private final LabTestService labTestService;

    @GetMapping
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return ResponseEntity.ok(this.labTestService.getAllLabTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTest> getLabTest(@PathVariable Long id) {
        return ResponseEntity.ok(labTestService.getLabTest(id));
    }

    @PostMapping
    public ResponseEntity<LabTest> save(@RequestBody LabTest labTest) {
        return ResponseEntity.ok(labTestService.save(labTest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTest> update(@PathVariable Long id, @RequestBody LabTest labTest) {
        return ResponseEntity.ok(labTestService.update(id, labTest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(this.labTestService.delete(id));
    }
}
