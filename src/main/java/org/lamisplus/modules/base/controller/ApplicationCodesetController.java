package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeset;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/application-codesets")
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodesetController {
    private final ApplicationCodesetService applicationCodesetService;
    private static String ENTITY_NAME = "ApplicationCodeset";

    @GetMapping("/codesetGroup")
    public ResponseEntity<List<ApplicationCodesetDTO>> getApplicationCodeByCodesetGroup(@RequestParam String codesetGroup) {
        return ResponseEntity.ok(this.applicationCodesetService.getApplicationCodeByCodesetGroup(codesetGroup));
    }

   /* @GetMapping("/{id}")
    public ResponseEntity<ApplicationCodesetDTO> getApplicationCodeset(@PathVariable Long id) {
        return ResponseEntity.ok(this.applicationCodesetService.getApplicationCodeset(id));
    }*/

    @GetMapping
    public ResponseEntity<List<ApplicationCodesetDTO>> getAllApplicationCodesets() {
        return ResponseEntity.ok(this.applicationCodesetService.getAllApplicationCodeset());
    }

    @PostMapping
    public ResponseEntity<ApplicationCodeset> save(@RequestBody ApplicationCodesetDTO applicationCodesetDTO) throws URISyntaxException {
        ApplicationCodeset applicationCodeset = applicationCodesetService.save(applicationCodesetDTO);
        return ResponseEntity.created(new URI("/api/application-codesets/" + applicationCodeset.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(applicationCodeset.getId()))).body(applicationCodeset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationCodeset> update(@PathVariable Long id, @RequestBody ApplicationCodesetDTO applicationCodesetDTO) throws URISyntaxException {
        ApplicationCodeset applicationCodeset = applicationCodesetService.update(id, applicationCodesetDTO);
        return ResponseEntity.created(new URI("/api/application-codesets/" + applicationCodeset.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(applicationCodeset.getId()))).body(applicationCodeset);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.applicationCodesetService.delete(id));
    }
}
