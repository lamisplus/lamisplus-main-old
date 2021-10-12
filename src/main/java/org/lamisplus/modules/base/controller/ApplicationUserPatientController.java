package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.service.ApplicationUserPatientService;
import org.lamisplus.modules.base.service.PatientService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/application_user_patient")
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientController {
    private final ApplicationUserPatientService applicationUserPatientService;
    private final PatientService patientService;


    /*@GetMapping("/patients/{patientId}")
    public ResponseEntity<UserDTO> getAllApplicationUserByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(applicationUserPatientService.getAllApplicationUserByPatientId(patientId));
    }*/



    @PostMapping
    public ResponseEntity<List<ApplicationUserPatient>> save(@RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
        return ResponseEntity.ok(applicationUserPatientService.save(applicationUserPatientDTO));

    }

    @PostMapping("/unassign")
    public ResponseEntity<List<ApplicationUserPatient>> unassignCaseManagerToPatient (@RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
        return ResponseEntity.ok(applicationUserPatientService.unassignCaseManagerToPatient(applicationUserPatientDTO));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApplicationUserPatientDTO> update(@PathVariable Long id, @RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
        return ResponseEntity.ok(applicationUserPatientService.update(id, applicationUserPatientDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(applicationUserPatientService.delete(id));
    }
}
