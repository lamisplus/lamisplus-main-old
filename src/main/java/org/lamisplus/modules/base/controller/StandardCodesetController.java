package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.StandardCodeset;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.lamisplus.modules.base.service.StandardCodesetService;
import org.lamisplus.modules.base.service.StandardCodesetSourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/standard_codesets")
@Slf4j
@RequiredArgsConstructor
@Audit
public class StandardCodesetController {
    private final StandardCodesetService standardCodesetService;

    @GetMapping
    public ResponseEntity<List<StandardCodesetDTO>> getAllStandardCodeset() {
        return ResponseEntity.ok(this.standardCodesetService.getAllStandardCodeset());
    }

    @GetMapping("/standard_codeset_source/{id}")
    public ResponseEntity<List<StandardCodesetDTO>> getAllStandardCodesetByStandardCodesetSourceId(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getAllStandardCodesetByStandardCodesetSourceId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetById(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetByCode(@PathVariable String code) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetByCode(code));
    }

    @GetMapping("/application_codeset/{id}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetByApplicationCodesetId(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetByApplicationCodesetId(id));
    }

    @PostMapping
    public ResponseEntity<StandardCodeset> save(@RequestBody StandardCodesetDTO standardCodesetDTO) {
        return ResponseEntity.ok(standardCodesetService.save(standardCodesetDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardCodeset> update(@PathVariable Long id, @RequestBody StandardCodesetDTO standardCodesetDTO) {
        return ResponseEntity.ok(this.standardCodesetService.update(id, standardCodesetDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.standardCodesetService.delete(id));
    }
}
