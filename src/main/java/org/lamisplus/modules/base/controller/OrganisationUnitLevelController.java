package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitLevel;
import org.lamisplus.modules.base.service.OrganisationUnitLevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/organisation-unit-levels")
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitLevelController {
    private final OrganisationUnitLevelService organisationUnitLevelService;
    private static final String ENTITY_NAME = "OrganisationUnitLevel";

    @PostMapping
    public ResponseEntity<OrganisationUnitLevel> save(@RequestBody OrganisationUnitLevel organisationUnitLevel) throws URISyntaxException {
        OrganisationUnitLevel result = organisationUnitLevelService.save(organisationUnitLevel);
        return ResponseEntity.created(new URI("/api/organisation-unit-levels/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<OrganisationUnitLevel> update(@PathVariable Long id, @RequestBody OrganisationUnitLevel organisationUnitLevel) throws URISyntaxException {
        OrganisationUnitLevel result = organisationUnitLevelService.update(id, organisationUnitLevel);
        return ResponseEntity.created(new URI("/api/organisation-unit-levels/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping
    public ResponseEntity<List<OrganisationUnitLevel>> getAllOrganizationUnitLevel() {
        return ResponseEntity.ok(organisationUnitLevelService.getAllOrganizationUnitLevel());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganisationUnitLevel> getOrganizationUnitLevel(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.getOrganizationUnitLevel(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.delete(id));
    }

}
