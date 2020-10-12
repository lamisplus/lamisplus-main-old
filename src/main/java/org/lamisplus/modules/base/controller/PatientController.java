package org.lamisplus.modules.base.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.service.PatientService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients")
public class PatientController {
    private final String ENTITY_NAME = "Patient";
    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(this.patientService.getAllPatients());
    }

    @GetMapping("/hospitalNumber")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber(@RequestParam String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}")
    public ResponseEntity<PatientDTO> getPatientByHospitalNumber2(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.getPatientByHospitalNumber(hospitalNumber));
    }

    @GetMapping("/{hospitalNumber}/exist")
    public ResponseEntity<Boolean> exist(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(this.patientService.exist(hospitalNumber));
    }

    @GetMapping("/{id}/encounters/{formCode}")
    public ResponseEntity<List> getEncountersByPatientIdAndFormCode(@PathVariable Long id,
                                                                    @PathVariable String formCode, @RequestParam(required = false) String sortOrder,
                                                                    @RequestParam (required = false) String sortField, @RequestParam(required = false) Integer limit){
        return ResponseEntity.ok(this.patientService.getEncountersByPatientIdAndFormCode(id, formCode, sortField, sortOrder, limit));
    }

    /*@GetMapping("/{id}/encounters/{fCode}")
    public ResponseEntity<List> getEncountersByPatientIdAndFCode(@PathVariable Long id,
                                                                    @PathVariable String fCode,Pageable pageable) {
        final Page<Encounter> page = patientService.getEncountersByPatientIdAndFCode(pageable, id, fCode);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }*/

    @GetMapping("/{id}/encounters/programCodeExclusionList")
    public ResponseEntity<List> getEncountersByPatientIdAndProgramCodeExclusionList(@PathVariable Long id, @RequestParam(required = false) List<String> programCodeExclusionList) {
        return ResponseEntity.ok(this.patientService.getEncountersByPatientIdAndProgramCodeExclusionList(id, programCodeExclusionList));
    }

    @ApiOperation(value="getVisitByPatientIdAndVisitDate", notes = "patientId= required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - /api/patient/20/visits?dateStart=02-03-2020")
    @GetMapping("/{id}/visits/{dateStart}/{dateEnd}")
    public ResponseEntity<List<VisitDTO>> getVisitByPatientIdAndVisitDate(@PathVariable Optional<Long> id, @ApiParam(defaultValue = "",required = false) @PathVariable(required = false) Optional<String> dateStart,
                                                                          @ApiParam(defaultValue = "",required = false) @PathVariable(required = false) Optional <String> dateEnd) {
        return ResponseEntity.ok(patientService.getVisitByPatientIdAndVisitDate(id,dateStart,dateEnd));
    }

    @ApiOperation(value="getEncountersByPatientIdAndDateEncounter", notes = " programCode= required, formCode=required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - api/encounters/{programCode}/{formCode}?dateStart=01-01-2020&dateEnd=01-04-2020")
    @GetMapping("/{id}/encounters/{formCode}/{dateStart}/{dateEnd}")
    public List getEncountersByPatientIdAndDateEncounter(@PathVariable Long id, @PathVariable String formCode,
                                                         @ApiParam(defaultValue = "") @PathVariable(required = false) Optional<String> dateStart,
                                                         @ApiParam(defaultValue = "") @PathVariable(required = false) Optional<String> dateEnd) {
        return patientService.getEncountersByPatientIdAndDateEncounter(id, formCode, dateStart, dateEnd);
    }

    @ApiOperation(value="getAllEncountersByPatientId", notes = " id=required\n\n" +
            "Example - /api/encounters/20")
    @GetMapping("/{id}/encounters")
    public ResponseEntity<List> getAllEncounterByPatientId(@PathVariable Long id){
        return ResponseEntity.ok(this.patientService.getAllEncountersByPatientId(id));
    }

    //TODO: in progress...
   /* @GetMapping("/{id}/{programCode}/form")
    public ResponseEntity<List<Form>> getAllFormsByPatientIdAndPrecedence(@PathVariable Long patientId, @PathVariable String programCode){
        return ResponseEntity.ok(this.patientService.getAllFormsByPatientIdAndPrecedence(patientId, programCode));
    }*/

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
    public ResponseEntity<Person> save(@RequestBody PatientDTO patientDTO) throws URISyntaxException {
        Person person = this.patientService.save(patientDTO);
        return ResponseEntity.created(new URI("/api/patients/" + person.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(person.getId()))).body(person);
    }

    @PutMapping("/{id}")
    public Person update(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        return this.patientService.update(id, patientDTO);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.patientService.delete(id));
    }
}
