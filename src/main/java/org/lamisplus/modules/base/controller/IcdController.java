package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.IcdDTO;
import org.lamisplus.modules.base.domain.entity.Icd;
import org.lamisplus.modules.base.service.IcdService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/icd")
@Slf4j
@RequiredArgsConstructor
public class IcdController {

    private final IcdService icdService;
    private static final String ENTITY_NAME = "Icd";

    @PostMapping
    public ResponseEntity<Icd> save(@RequestBody IcdDTO icdDTO) throws URISyntaxException {
        Icd result = icdService.save(icdDTO);
        return ResponseEntity.created(new URI("/api/icd/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<Icd> update(@PathVariable Long id, @RequestBody IcdDTO icdDTO) throws URISyntaxException {
        Icd result = icdService.update(id, icdDTO);
        return ResponseEntity.created(new URI("/api/icd/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping
    public ResponseEntity<List<IcdDTO>> getAllStandardCodesets() {
        return ResponseEntity.ok(icdService.getAllIcd());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IcdDTO> getStandardCodeset(@PathVariable Long id) {
        return ResponseEntity.ok(icdService.getIcd(id));
    }

    @GetMapping("/diagnosis/{categoryCode}")
    public ResponseEntity<List<IcdDTO>> getDiagnosisByCategory(@PathVariable String categoryCode) {
        return ResponseEntity.ok(icdService.getDiagnosisByCategory(categoryCode));
    }

    @GetMapping("/category")
    public ResponseEntity<List> getAllCategory() {
        return ResponseEntity.ok(icdService.getAllDistinctCategoryCodeAndCategoryTitle());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.icdService.delete(id));
    }
}
