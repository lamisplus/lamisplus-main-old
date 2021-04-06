package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.dto.ClinicianPatientDTO;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.entity.ClinicianPatient;
import org.lamisplus.modules.base.base.service.ClinicianPatientService;
import org.lamisplus.modules.base.base.util.UuidGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/clinician-patients")
@Slf4j
@RequiredArgsConstructor
public class ClinicianPatientController {
    private static String ENTITY_NAME = "ClinicianPatient";
    private final ClinicianPatientService clinicianPatientService;

    @PostMapping
    public ResponseEntity<ClinicianPatient> assignClinician(@RequestBody ClinicianPatientDTO clinicianPatientDTO) throws URISyntaxException {
        ClinicianPatient clinicianPatient = clinicianPatientService.save(clinicianPatientDTO);
        return ResponseEntity.created(new URI("/api/clinician-patients"))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(UuidGenerator.getUuid()))).body(clinicianPatient);
    }

    @GetMapping
    public ResponseEntity<List<ClinicianPatientDTO>> getAllClinicianPatients() {
        return ResponseEntity.ok(clinicianPatientService.getAllClinicianPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicianPatientDTO> getEncounter(@PathVariable Long id) {
        return ResponseEntity.ok(this.clinicianPatientService.getClinicianPatient(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClinicianPatient> update(@PathVariable Long id, @RequestBody ClinicianPatientDTO clinicianPatientDTO) throws URISyntaxException {
        ClinicianPatient clinicianPatient = clinicianPatientService.update(id, clinicianPatientDTO);
        return ResponseEntity.created(new URI("/api/clinician-patients"))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(UuidGenerator.getUuid()))).body(clinicianPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.clinicianPatientService.delete(id));
    }
}
