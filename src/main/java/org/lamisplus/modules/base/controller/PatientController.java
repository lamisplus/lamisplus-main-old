package org.lamisplus.modules.base.controller;

import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.service.PatientService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients")
@Audit
public class PatientController {
    private final PatientService patientService;

    /*@GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients(@PageableDefault(value = 100) Pageable pageable) {
        Page<PatientDTO> page = patientService.findPage(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(patientService.getAllPatients(page), headers, HttpStatus.OK);
    }*/

    @GetMapping
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(this.patientService.getAllPatients());
    }

    @GetMapping("/totalCount")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(this.patientService.getTotalCount());
    }


    @GetMapping("/hospitalNumber")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber(@RequestParam String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber2(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}/exist")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<Boolean> exist(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.exist(hospitalNumber));
    }
  
    @GetMapping("/{id}/encounters/{formCode}")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getEncountersByPatientIdAndFormCode(@PathVariable Long id,
                                                                    @PathVariable String formCode, @RequestParam(required = false) String sortOrder,
                                                                    @RequestParam (required = false) String sortField, @RequestParam(required = false) Integer limit,
                                                                    @PageableDefault(value = 100) Pageable pageable){
        return ResponseEntity.ok(this.patientService.getEncountersByPatientIdAndFormCode(pageable, id, formCode, sortField, sortOrder, limit));
    }

    /*@GetMapping("/{id}/encounters/test/{fCode}")
    public ResponseEntity<List> getEncountersByPatientIdAndFCode(@PathVariable Long id,
                                                                 @PathVariable String fCode, @RequestParam (required = false) String sortField,
                                                                 @RequestParam(required = false) String sortOrder, @RequestParam(required = false) Integer limit,
                                                                 @PageableDefault(value = 100) Pageable pageable) {
        final Page<Encounter> page = patientService.getEncountersByPatientIdAndFCode(pageable, id, fCode,sortField, sortOrder, limit);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }*/

    @GetMapping("/{id}/encounters/programCodeExclusionList")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getEncountersByPatientIdAndProgramCodeExclusionList(@PathVariable Long id, @RequestParam(required = false) List<String> programCodeExclusionList) {
        return ResponseEntity.ok(this.patientService.getEncountersByPatientIdAndProgramCodeExclusionList(id, programCodeExclusionList));
    }

    @GetMapping("/{programCode}/registered")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getAllPatientsByProgramCode(@PathVariable String programCode) {
        return ResponseEntity.ok(this.patientService.getAllPatientsByProgramCode(programCode));
    }



    /*@ApiOperation(value="getVisitByPatientIdAndVisitDate", notes = "patientId= required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - /api/patient/20/visits?dateStart=02-03-2020")*/
    @GetMapping("/{id}/visits/{dateStart}/{dateEnd}")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List<VisitDTO>> getVisitByPatientIdAndVisitDate(@PathVariable Optional<Long> id, @ApiParam(defaultValue = "",required = false) @PathVariable(required = false) Optional<String> dateStart,
                                                                          @ApiParam(defaultValue = "",required = false) @PathVariable(required = false) Optional <String> dateEnd) {
        return ResponseEntity.ok(patientService.getVisitByPatientIdAndVisitDate(id,dateStart,dateEnd));
    }

    /*@ApiOperation(value="getEncountersByPatientIdAndDateEncounter", notes = " programCode= required, formCode=required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - api/encounters/{programCode}/{formCode}?dateStart=01-01-2020&dateEnd=01-04-2020")*/
    @GetMapping("/{id}/encounters/{formCode}/{dateStart}/{dateEnd}")
    @PreAuthorize("hasAuthority('patient_read')")
    public List getEncountersByPatientIdAndDateEncounter(@PathVariable Long id, @PathVariable String formCode,
                                                         @ApiParam(defaultValue = "") @PathVariable(required = false) Optional<String> dateStart,
                                                         @ApiParam(defaultValue = "") @PathVariable(required = false) Optional<String> dateEnd) {
        return patientService.getEncountersByPatientIdAndDateEncounter(id, formCode, dateStart, dateEnd);
    }

    /*@ApiOperation(value="getAllEncountersByPatientId", notes = " id=required\n\n" +
            "Example - /api/encounters/20")*/
    @GetMapping("/{id}/encounters")
    @PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getAllEncounterByPatientId(@PathVariable Long id){
        return ResponseEntity.ok(this.patientService.getAllEncountersByPatientId(id));
    }

    @GetMapping("/{id}/{programCode}/form")
    public ResponseEntity<List<Form>> getAllFormsByPatientIdAndProgramCode(@PathVariable Long id, @PathVariable String programCode){
        return ResponseEntity.ok(this.patientService.getAllFormsByPatientIdAndProgramCode(id, programCode));
    }

    @GetMapping("/{id}/{programCode}/filledForms")
    public ResponseEntity<List<Form>> getFilledFormsByPatientIdAndProgramCode(@PathVariable Long id, @PathVariable String programCode){
        return ResponseEntity.ok(this.patientService.getFilledFormsByPatientIdAndProgramCode(id, programCode));
    }

    @GetMapping("/{id}/programEnrolled")
    public ResponseEntity<List> getAllProgramEnrolled(@PathVariable Long id){
        return ResponseEntity.ok(this.patientService.getAllProgramEnrolled(id));
    }

/*    @ApiOperation(value="getFormsByPatientId", notes = " id=required, formCode=required\n\n")
    @GetMapping("/{id}/{formCode}")
    public ResponseEntity<List<EncounterDTO>> getFormsByPatientId(@PathVariable Long id, @PathVariable String formCode) throws BadRequestAlertException {
        return ResponseEntity.ok(this.patientService.getFormsByPatientId(id, formCode));
    }*/


/*    @ApiOperation(value="getFormsByPatientId", notes = " id=required, formCode=required\n\n")
    @GetMapping("/{id}/form")
    public ResponseEntity<List<Form>> getFormsByPatientId(@PathVariable Long id) throws BadRequestAlertException {
        return ResponseEntity.ok(this.patientService.getFormsByPatientId(id, formCode));
    }*/

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('patient_write')")
    public ResponseEntity<Person> save(@RequestBody PatientDTO patientDTO) {
        return ResponseEntity.ok(this.patientService.save(patientDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('patient_write')")
    public Person update(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        return this.patientService.update(id, patientDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('patient_delete')")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.patientService.delete(id));
    }
}
