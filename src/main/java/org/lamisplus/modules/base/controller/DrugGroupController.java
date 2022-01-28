package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.service.DrugGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drug-groups")
@Slf4j
@RequiredArgsConstructor
public class DrugGroupController {
    private final DrugGroupService drugGroupService;

    @GetMapping
    public ResponseEntity<List<DrugGroup>> getAllDrugGroups() {
        return ResponseEntity.ok(drugGroupService.getAllDrugGroups());
    }
    @GetMapping("/{id}")
    public ResponseEntity<DrugGroup> getDrugGroup(@PathVariable Long id) {
        return ResponseEntity.ok(drugGroupService.getDrugGroup(id));
    }

    @GetMapping("/{id}/drugs")
    public ResponseEntity<List<DrugDTO>> getDrugsByDrugGroupId(@PathVariable Long id) {
        return ResponseEntity.ok(drugGroupService.getDrugsByDrugGroupId(id));
    }

    @PostMapping
    public ResponseEntity<DrugGroup> save(@RequestBody DrugGroup drugGroup) {
        return ResponseEntity.ok(drugGroupService.save(drugGroup));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugGroup> update(@PathVariable Long id, @RequestBody DrugGroup drugGroup) {
        return ResponseEntity.ok(drugGroupService.update(id, drugGroup));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(drugGroupService.delete(id));
    }
}
