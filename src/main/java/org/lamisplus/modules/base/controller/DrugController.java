package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.Drug;
import org.lamisplus.modules.base.service.DrugService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/drugs")
@Slf4j
@RequiredArgsConstructor
@Audit
public class DrugController {

    private final DrugService drugService;

    @GetMapping
    public ResponseEntity<List<DrugDTO>> getAllDrugs() {
        return ResponseEntity.ok(this.drugService.getAllDrugs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrugDTO> getDrug(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getDrug(id));
    }

    @GetMapping("/regimen/{regimenId}")
    public ResponseEntity<List<DrugDTO>> getDrugsByRegimenId(@PathVariable Long regimenId) {
        return ResponseEntity.ok(drugService.getDrugsByRegimenId(regimenId));
    }

    @PostMapping
    public ResponseEntity<Drug> save(@RequestBody Drug drug) {
        return ResponseEntity.ok(drugService.save(drug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Drug> update(@PathVariable Long id, @RequestBody DrugDTO drugDTO) {
        return ResponseEntity.ok(drugService.update(id, drugDTO));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.drugService.delete(id));
    }
}
