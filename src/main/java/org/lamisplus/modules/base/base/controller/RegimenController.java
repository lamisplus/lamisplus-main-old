package org.lamisplus.modules.base.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.Regimen;
import org.lamisplus.modules.base.base.service.RegimenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/regimens")
@Slf4j
@RequiredArgsConstructor
public class RegimenController {
    private final RegimenService regimenService;
    private static final String ENTITY_NAME = "Regimen";

    @PostMapping
    public ResponseEntity<Regimen> save(@RequestBody Regimen regimen) throws URISyntaxException {
        Regimen result = regimenService.save(regimen);
        return ResponseEntity.created(new URI("/api/regimens/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<Regimen> update(@PathVariable Long id, @RequestBody Regimen regimen) throws URISyntaxException {
        Regimen result = regimenService.update(id, regimen);
        return ResponseEntity.created(new URI("/api/regimens/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping
    public ResponseEntity<List<Regimen>> getAllRegimens() {
        return ResponseEntity.ok(regimenService.getAllRegimens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Regimen> getRegimen(@PathVariable Long id) {
        return ResponseEntity.ok(regimenService.getRegimen(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id){
        return ResponseEntity.ok(this.regimenService.delete(id));
    }
}
