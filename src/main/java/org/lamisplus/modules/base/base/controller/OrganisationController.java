package org.lamisplus.modules.base.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.Organisation;
import org.lamisplus.modules.base.base.service.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/organisations")
@Slf4j
@RequiredArgsConstructor
public class OrganisationController {
    private final OrganisationService organisationService;
    private static final String ENTITY_NAME = "Organisation";

    @PostMapping
    public ResponseEntity<Organisation> save(@RequestBody Organisation organisation) throws URISyntaxException {
        Organisation result = organisationService.save(organisation);
        return ResponseEntity.created(new URI("/api/organisations/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<Organisation> update(@PathVariable Long id, @RequestBody Organisation organisation) throws URISyntaxException {
        Organisation result = organisationService.update(id, organisation);
        return ResponseEntity.created(new URI("/api/organisations/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping
    public ResponseEntity<List<Organisation>> getAllOrganizations() {
        return ResponseEntity.ok(organisationService.getAllOrganizations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organisation> getOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(organisationService.getOrganization(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.organisationService.delete(id));
    }
}
