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
    private static final String ENTITY_NAME = "Visit";
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
    public ResponseEntity<Visit> save(@RequestBody VisitDTO visitDTO) throws URISyntaxException {
        Visit visit1 = this.visitService.save(visitDTO);
        return ResponseEntity.created(new URI("/api/visits/" + visit1.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(visit1.getId()))).body(visit1);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(@RequestBody Visit visit, @PathVariable Long id) throws URISyntaxException{
        Visit result = visitService.update(id, visit);
        return ResponseEntity.created(new URI("/api/visits/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.visitService.delete(id));
    }
}
