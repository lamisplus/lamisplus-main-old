package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.Drug;
import org.lamisplus.modules.base.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.base.service.DrugGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/drug-groups")
@Slf4j
@RequiredArgsConstructor
public class DrugGroupController {
    private final DrugGroupService drugGroupService;
    private final String ENTITY_NAME = "DrugGroup";

    @GetMapping
    public ResponseEntity<List<DrugGroup>> getAllDrugGroups() {
        return ResponseEntity.ok(this.drugGroupService.getAllDrugGroups());
    }
    @GetMapping("/{id}")
    public ResponseEntity<DrugGroup> getDrugGroup(@PathVariable Long id) {
        return ResponseEntity.ok(drugGroupService.getDrugGroup(id));
    }

    @GetMapping("/{id}/drugs")
    public ResponseEntity<List<Drug>> getDrugByDrugGroupId(@PathVariable Long id) {
        return ResponseEntity.ok(drugGroupService.getDrugByDrugGroupId(id));
    }

    @PostMapping
    public ResponseEntity<DrugGroup> save(@RequestBody DrugGroup drugGroup) throws URISyntaxException {
        DrugGroup result = drugGroupService.save(drugGroup);
        return ResponseEntity.created(new URI("/api/drug-groups/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugGroup> update(@PathVariable Long id, @RequestBody DrugGroup drugGroup) throws URISyntaxException {
        DrugGroup result = drugGroupService.update(id, drugGroup);
        return ResponseEntity.created(new URI("/api/drug-groups/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id)))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.drugGroupService.delete(id));
    }
}
