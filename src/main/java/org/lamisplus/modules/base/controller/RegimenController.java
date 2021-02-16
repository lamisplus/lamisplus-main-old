package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.RegimenDTO;
import org.lamisplus.modules.base.domain.entity.Regimen;
import org.lamisplus.modules.base.domain.entity.RegimenLine;
import org.lamisplus.modules.base.repository.RegimenRepository;
import org.lamisplus.modules.base.service.RegimenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/regimens")
@Slf4j
@RequiredArgsConstructor
@Audit
public class RegimenController {
    private final RegimenService regimenService;

    @PostMapping
    public ResponseEntity<RegimenDTO> save(@RequestBody RegimenDTO regimenDTO) {
        return ResponseEntity.ok(regimenService.save(regimenDTO));
    }

    @PutMapping("{id}")
    public ResponseEntity<RegimenDTO> update(@PathVariable Long id, @RequestBody RegimenDTO regimenDTO) {
        return ResponseEntity.ok(regimenService.update(id, regimenDTO));

    }

    @GetMapping
    public ResponseEntity<List<RegimenDTO>> getAllRegimens() {
        return ResponseEntity.ok(regimenService.getAllRegimens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegimenDTO> getRegimen(@PathVariable Long id) {
        return ResponseEntity.ok(regimenService.getRegimen(id));
    }

    @GetMapping("/regimenLine/{regimenLineId}")
    public ResponseEntity<List<RegimenDTO>> getRegimensByRegimenLineId(@PathVariable Long regimenLineId) {
        return ResponseEntity.ok(regimenService.getRegimensByRegimenLineId(regimenLineId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(this.regimenService.delete(id));
    }
}
