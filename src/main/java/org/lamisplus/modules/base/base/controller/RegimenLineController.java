package org.lamisplus.modules.base.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.base.domain.entity.Regimen;
import org.lamisplus.modules.base.base.domain.entity.RegimenLine;
import org.lamisplus.modules.base.base.service.RegimenLineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/regimen-lines")
@Slf4j
@RequiredArgsConstructor
@Audit
public class RegimenLineController {
    private final RegimenLineService regimenLineService;

    @PostMapping
    public ResponseEntity<RegimenLine> save(@RequestBody RegimenLine regimenLine) {
        return ResponseEntity.ok(regimenLineService.save(regimenLine));
    }

    @PutMapping("{id}")
    public ResponseEntity<RegimenLine> update(@PathVariable Long id, @RequestBody RegimenLine regimenLine) {
        return ResponseEntity.ok(regimenLineService.update(id, regimenLine));
    }

    @GetMapping
    public ResponseEntity<List<RegimenLine>> getAllRegimenLines() {
        return ResponseEntity.ok(regimenLineService.getAllRegimenLines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegimenLine> getRegimenLine(@PathVariable Long id) {
        return ResponseEntity.ok(regimenLineService.getRegimenLine(id));
    }

    @GetMapping("/{id}/regimens")
    public ResponseEntity<List<Regimen>> getRegimenByRegimenLineId(@PathVariable Long id) {
        return ResponseEntity.ok(regimenLineService.getRegimenByRegimenLineId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(regimenLineService.delete(id));
    }
}
