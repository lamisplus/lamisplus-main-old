package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.service.ApplicationUserOrganisationUnitService;
import org.lamisplus.modules.base.service.FormDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/application_user_organisation_unit")
@Slf4j
@RequiredArgsConstructor
@Audit
public class ApplicationUserOrganisationUnitController {
    private final ApplicationUserOrganisationUnitService applicationUserOrganisationUnitService;
    //private static final String ENTITY_NAME = "ApplicationUserOrganisationUnit";


    @GetMapping
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> getAllApplicationUserOrganisationUnit() {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getAllApplicationUserOrganisationUnit());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationUserOrganisationUnit> getApplicationUserOrganisationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getApplicationUserOrganisationUnit(id));
    }

    @PostMapping
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> save(@RequestBody List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.save(applicationUserOrganisationUnitDTO));

    }

    @PutMapping("{id}")
    public ResponseEntity<ApplicationUserOrganisationUnit> update(@PathVariable Long id, @RequestBody ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.update(id, applicationUserOrganisationUnit));
    }

    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Long id, @RequestBody ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return this.applicationUserOrganisationUnitService.delete(id, applicationUserOrganisationUnit);
    }
}
