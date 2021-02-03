package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.lamisplus.modules.base.service.VisitService;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("api/visits")
@RequiredArgsConstructor
@Audit
public class VisitController {
    private final VisitService visitService;

    @GetMapping
    public ResponseEntity<List<VisitDTO>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/totalCount/checkIn")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(visitService.getVisitType());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitDTO> getVisit(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisit(id));
    }

    @PostMapping
    public ResponseEntity<Visit> save(@RequestBody VisitDTO visitDTO) {
        return ResponseEntity.ok(this.visitService.save(visitDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(@RequestBody Visit visit, @PathVariable Long id) {
        return ResponseEntity.ok(visitService.update(id, visit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.visitService.delete(id));
    }
}
