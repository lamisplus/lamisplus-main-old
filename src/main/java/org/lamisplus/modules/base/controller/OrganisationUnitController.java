package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/organisation-units")
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitController {

    private final OrganisationUnitService organisationUnitService;
    private static final String ENTITY_NAME = "OrganisationUnit";

    @PostMapping
    public ResponseEntity<OrganisationUnit> save(@RequestBody OrganisationUnitDTO organisationUnitDTO) throws URISyntaxException {
        OrganisationUnit result = organisationUnitService.save(organisationUnitDTO);
        return ResponseEntity.created(new URI("/api/organisation-units/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<OrganisationUnit> update(@PathVariable Long id, @RequestBody OrganisationUnitDTO organisationUnitDTO) throws URISyntaxException {
        OrganisationUnit result = organisationUnitService.update(id, organisationUnitDTO);
        return ResponseEntity.created(new URI("/api/organisation-units/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganisationUnit> getOrganizationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitService.getOrganizationUnit(id));
    }

    @GetMapping
    public ResponseEntity<List<OrganisationUnit>> getAllOrganizationUnit() {
        return ResponseEntity.ok(organisationUnitService.getAllOrganizationUnit());
    }

    @GetMapping ("/parent-org-unit/{id}")
    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByParentOrganisationUnitId(@PathVariable Long id) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByParentOrganisationUnitId(id));
    }

    @GetMapping ("/{parentOrgUnitId}/{orgUnitLevelId}")
    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(
            @PathVariable Long parentOrgUnitId, @PathVariable Long orgUnitLevelId) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(parentOrgUnitId, orgUnitLevelId));
    }

    @GetMapping ("/organisation-unit-level/{id}")
    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByOrganisationUnitLevelId(@PathVariable Long id) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByOrganisationUnitLevelId(id));
    }

    @GetMapping ("/hierarchy/{parentOrgUnitId}/{orgUnitLevelId}")
    public  ResponseEntity<List<OrganisationUnitDTO>>  getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(
            @PathVariable Long parentOrgUnitId, @PathVariable Long orgUnitLevelId) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(parentOrgUnitId, orgUnitLevelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitService.delete(id));
    }

}
