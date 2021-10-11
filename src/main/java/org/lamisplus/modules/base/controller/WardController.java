package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.WardDTO;
import org.lamisplus.modules.base.domain.entity.Ward;
import org.lamisplus.modules.base.service.WardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/wards")
@Slf4j
@RequiredArgsConstructor
public class WardController {
    private final WardService wardService;
    private static String ENTITY_NAME = "Ward";


    @GetMapping("/{id}")
    public ResponseEntity<WardDTO> getWard(@PathVariable Long id) {
        return ResponseEntity.ok(this.wardService.getWard(id));
    }

    @GetMapping
    public ResponseEntity<List<WardDTO>> getAllWards() {
        return ResponseEntity.ok(this.wardService.getAllWards());
    }

    @PostMapping
    public ResponseEntity<Ward> save(@RequestBody WardDTO wardDTO) throws URISyntaxException {
        Ward ward = wardService.save(wardDTO);
        return ResponseEntity.created(new URI("/api/wards/" + ward.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(ward.getId()))).body(ward);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ward> update(@PathVariable Long id, @RequestBody WardDTO wardDTO) throws URISyntaxException {
        Ward ward = wardService.update(id, wardDTO);
        return ResponseEntity.created(new URI("/api/wards" + ward.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(ward.getId()))).body(ward);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.wardService.delete(id));
    }
}
