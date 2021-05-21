package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.Patient;
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

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients(@RequestParam (required = false, defaultValue = "%*%") String firstName,
                                                           @RequestParam (required = false, defaultValue = "%*%") String lastName,
                                                           @RequestParam (required = false, defaultValue = "%*%") String hospitalNumber,
                                                           @RequestParam (required = false)String key,
                                                           @RequestParam (required = false)String value,
                                                           @RequestParam (required = false, defaultValue = "%*%") String searchValue,
                                                           @PageableDefault(value = 100) Pageable pageable) {
        Page<Patient> page;
        if(key != null && !key.isEmpty() && value != null && !value.isEmpty()){
            value = "%"+value+"%";
            page = patientService.findPage(key, value, pageable);
        } else if(!firstName.equals("%*%") || !lastName.equals("%*%") || !hospitalNumber.equals("%*%")){
            if(!firstName.equals("%*%"))firstName = "%"+firstName+"%";
            if(!lastName.equals("%*%"))lastName = "%"+lastName+"%";
            if(!hospitalNumber.equals("%*%"))hospitalNumber = "%"+hospitalNumber+"%";
            page = patientService.findPage(firstName, lastName,hospitalNumber, pageable);

        } else if(!searchValue.equals("%*%")) {
            firstName = "%"+searchValue+"%";
            lastName = "%"+searchValue+"%";
            hospitalNumber = "%"+searchValue+"%";
            page = patientService.findAllPages(firstName, lastName,hospitalNumber, pageable);
        }
        else {
                page = patientService.findPage(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(patientService.getAllPatients(page), headers, HttpStatus.OK);
    }

    /*@GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }*/

    @GetMapping("/totalCount")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(patientService.getTotalCount());
    }


    @GetMapping("/hospitalNumber")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber(@RequestParam String hospitalNumber) {
        return ResponseEntity.ok(patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber2(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}/exist")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<Boolean> exist(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(patientService.exist(hospitalNumber));
    }
  
    @GetMapping("/{id}/encounters/{formCode}")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getEncountersByPatientIdAndFormCode(@PathVariable Long id,
                                                                    @PathVariable String formCode, @RequestParam(required = false) String sortOrder,
                                                                    @RequestParam (required = false) String sortField, @RequestParam(required = false) Integer limit,
                                                                    @PageableDefault(value = 100) Pageable pageable){
        return ResponseEntity.ok(patientService.getEncountersByPatientIdAndFormCode(pageable, id, formCode, sortField, sortOrder, limit));
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
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getEncountersByPatientIdAndProgramCodeExclusionList(@PathVariable Long id, @RequestParam(required = false) List<String> programCodeExclusionList) {
        return ResponseEntity.ok(patientService.getEncountersByPatientIdAndProgramCodeExclusionList(id, programCodeExclusionList));
    }

    @GetMapping("/{programCode}/registered")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getAllPatientsByProgramCode(@PathVariable String programCode) {
        return ResponseEntity.ok(patientService.getAllPatientsByProgramCode(programCode));
    }

    /*@ApiOperation(value="getVisitByPatientIdAndVisitDate", notes = "patientId= required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - /api/patient/20/visits?dateStart=02-03-2020")*/
    @GetMapping("/{id}/visits/{dateStart}/{dateEnd}")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List<VisitDTO>> getVisitByPatientIdAndVisitDate(@PathVariable Optional<Long> id, /*@ApiParam(defaultValue = "",required = false) */@PathVariable(required = false) Optional<String> dateStart,
                                                                          /*@ApiParam(defaultValue = "",required = false)*/ @PathVariable(required = false) Optional <String> dateEnd) {
        return ResponseEntity.ok(patientService.getVisitByPatientIdAndVisitDate(id,dateStart,dateEnd));
    }

    /*@ApiOperation(value="getEncountersByPatientIdAndDateEncounter", notes = " programCode= required, formCode=required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - api/encounters/{programCode}/{formCode}?dateStart=01-01-2020&dateEnd=01-04-2020")*/
    @GetMapping("/{id}/encounters/{formCode}/{dateStart}/{dateEnd}")
    //@PreAuthorize("hasAuthority('patient_read')")
    public List getEncountersByPatientIdAndDateEncounter(@PathVariable Long id, @PathVariable String formCode,
                                                         /*@ApiParam(defaultValue = "")*/ @PathVariable(required = false) Optional<String> dateStart,
                                                         /*@ApiParam(defaultValue = "")*/ @PathVariable(required = false) Optional<String> dateEnd) {
        return patientService.getEncountersByPatientIdAndDateEncounter(id, formCode, dateStart, dateEnd);
    }

    /*@ApiOperation(value="getAllEncountersByPatientId", notes = " id=required\n\n" +
            "Example - /api/encounters/20")*/
    @GetMapping("/{id}/encounters")
    //@PreAuthorize("hasAuthority('patient_read')")
    public ResponseEntity<List> getAllEncounterByPatientId(@PathVariable Long id){
        return ResponseEntity.ok(patientService.getAllEncountersByPatientId(id));
    }

    @GetMapping("/{id}/{programCode}/form")
    public ResponseEntity<List<FormDTO>> getAllFormsByPatientIdAndProgramCode(@PathVariable Long id, @PathVariable String programCode){
        return ResponseEntity.ok(patientService.getAllFormsByPatientIdAndProgramCode(id, programCode));
    }

    @GetMapping("/{id}/{programCode}/filledForms")
    public ResponseEntity<List<FormDTO>> getFilledFormsByPatientIdAndProgramCode(@PathVariable Long id, @PathVariable String programCode){
        return ResponseEntity.ok(patientService.getFilledFormsByPatientIdAndProgramCode(id, programCode));
    }

    @GetMapping("/{id}/programEnrolled")
    public ResponseEntity<List> getAllProgramEnrolled(@PathVariable Long id){
        return ResponseEntity.ok(patientService.getAllProgramEnrolled(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Patient> save(@RequestBody PatientDTO patientDTO) {
        return ResponseEntity.ok(patientService.save(patientDTO));
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        return patientService.update(id, patientDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.delete(id));
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

}
