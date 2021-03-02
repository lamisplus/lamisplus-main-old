package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.service.ApplicationUserPatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/application_user_patient")
@Slf4j
@RequiredArgsConstructor
@Audit
public class ApplicationUserPatientController {
    private final ApplicationUserPatientService applicationUserPatientService;


    @GetMapping("/patients/{patientId}")
    public ResponseEntity<UserDTO> getAllApplicationUserByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(applicationUserPatientService.getAllApplicationUserByPatientId(patientId));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<PatientDTO>> getAllApplicationUserPatientByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationUserPatientService.getAllPatientByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> save(@RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
        return ResponseEntity.ok(applicationUserPatientService.save(applicationUserPatientDTO));

    }

    @PutMapping("{id}")
    public ResponseEntity<ApplicationUserPatientDTO> update(@PathVariable Long id, @RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {

        return ResponseEntity.ok(applicationUserPatientService.update(id, applicationUserPatientDTO));

    }

    /*@DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Long id, @RequestBody ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return this.applicationUserPatientService.delete(id, applicationUserOrganisationUnit);
    }*/
}
