package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.service.ApplicationUserOrganisationUnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/application_user_organisation_unit")
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitController {
    private final ApplicationUserOrganisationUnitService applicationUserOrganisationUnitService;


    @GetMapping
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> getAllApplicationUserOrganisationUnit() {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getAllApplicationUserOrganisationUnit());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationUserOrganisationUnit> getApplicationUserOrganisationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getApplicationUserOrganisationUnit(id));
    }

    @PostMapping
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> save(@RequestBody Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO) {
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
