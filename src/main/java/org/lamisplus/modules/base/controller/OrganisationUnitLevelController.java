package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitLevelDTO;
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
@Audit
public class OrganisationUnitLevelController {
    private final OrganisationUnitLevelService organisationUnitLevelService;

    @PostMapping
    public ResponseEntity<OrganisationUnitLevelDTO> save(@RequestBody OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        return ResponseEntity.ok(organisationUnitLevelService.save(organisationUnitLevelDTO));
    }

    @PutMapping("{id}")
    public ResponseEntity<OrganisationUnitLevelDTO> update(@PathVariable Long id, @RequestBody OrganisationUnitLevelDTO organisationUnitLevelDTO){
        return ResponseEntity.ok(organisationUnitLevelService.update(id, organisationUnitLevelDTO));

    }

    @GetMapping
    public ResponseEntity<List<OrganisationUnitLevelDTO>> getAllOrganizationUnitLevel() {
        return ResponseEntity.ok(organisationUnitLevelService.getAllOrganizationUnitLevel());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganisationUnitLevelDTO> getOrganizationUnitLevel(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.getOrganizationUnitLevel(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.delete(id));
    }
}
