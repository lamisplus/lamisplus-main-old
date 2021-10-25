package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.service.ApplicationUserPatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/application_user_patient")
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientController {
    private final ApplicationUserPatientService applicationUserPatientService;

    @PostMapping("/assign")
    public ResponseEntity<List<ApplicationUserPatient>> save(@Valid @RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
        return ResponseEntity.ok(applicationUserPatientService.save(applicationUserPatientDTO));

    }

    @PostMapping("/unssign")
    public ResponseEntity<List<ApplicationUserPatient>> unassignCaseManagerToPatient (@Valid @RequestBody ApplicationUserPatientDTO applicationUserPatientDTO) {
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
