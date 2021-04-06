package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.Drug;
import org.lamisplus.modules.base.base.service.DrugService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/drugs")
@Slf4j
@RequiredArgsConstructor
public class DrugController {

    private final DrugService drugService;
    private static final String ENTITY_NAME = "Drug";

    @GetMapping
    public ResponseEntity<List<Drug>> getAllDrugs() {
        return ResponseEntity.ok(this.drugService.getAllDrugs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Drug> getDrug(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getDrug(id));
    }

    @PostMapping
    public ResponseEntity<Drug> save(@RequestBody Drug drug) throws URISyntaxException {
        Drug result = drugService.save(drug);
        return ResponseEntity.created(new URI("/api/drugs/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Drug> update(@PathVariable Long id, @RequestBody Drug drug) throws URISyntaxException {
        Drug result = drugService.update(id, drug);
        return ResponseEntity.created(new URI("/api/drugs/" + id))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(id)))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.drugService.delete(id));
    }
}
