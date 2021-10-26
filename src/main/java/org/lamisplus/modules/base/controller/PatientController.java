package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
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
    public ResponseEntity<List<PatientDTO>> getAllPatients(@RequestParam (required = false, defaultValue = "*") String searchValue,
                                                           @PageableDefault(value = 100) Pageable pageable) {
        Page<Patient> page;
        if(!searchValue.equals("*")) {
            String firstName = "%"+searchValue+"%";
            String lastName = "%"+searchValue+"%";
            String hospitalNumber = "%"+searchValue+"%";
            String mobilePhoneNumber = "%"+searchValue+"%";
            page = patientService.findAllPages(firstName, lastName,hospitalNumber,mobilePhoneNumber, pageable);
        }
        else {
            page = patientService.findPage(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(patientService.getAllPatients(page), headers, HttpStatus.OK);
    }

    @GetMapping("/{programCode}/{managed}/programs")
    public ResponseEntity<List<PatientDTO>> getPatientsNotManagedByProgramCode(@PathVariable String programCode,
                                                                               @PathVariable Boolean managed,
                                                                               @RequestParam (required = false, defaultValue = "*")  String gender,
                                                                               @RequestParam (required = false, defaultValue = "*") String state,
                                                                               @RequestParam (required = false, defaultValue = "*")String lga,
                                                                               @RequestParam (required = false, defaultValue = "0")Long applicationUserId,
                                                                               @RequestParam (required = false, defaultValue = "0")Integer ageFrom,
                                                                               @RequestParam (required = false, defaultValue = "200")Integer ageTo,
                                                                               @RequestParam (required = false, defaultValue = "false") Boolean pregnant,
                                                                               @PageableDefault(value = 100) Pageable pageable) {
        Page<Patient> page;
        if((ageFrom instanceof Integer && ageTo instanceof Integer) == true && ageFrom > ageTo){
            throw new IllegalTypeException(Patient.class, "Age", "not valid");
        }
        if(ageFrom > 0 && ageTo == 200){
            ageTo = ageFrom;
        }
        if(ageFrom == null && ageTo == null){
            ageTo = 200;
            ageFrom = 0;
        }
        if(((pregnant instanceof Boolean) == true && pregnant) && gender.equalsIgnoreCase("Male")){
            throw new IllegalTypeException(Patient.class, "Male & Pregnant", "not valid");
        }

        if(managed) {
            page = patientService.findAllByPatientManagedByFilteredParameters(gender, state, lga, ageTo, ageFrom, applicationUserId, pageable);
        } else {
            page = patientService.findAllByPatientNotManagedByFilteredParameters(programCode, gender, state, lga, pregnant, ageFrom, ageTo, pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(patientService.getAllPatients(page), headers, HttpStatus.OK);
    }

    @GetMapping("/totalCount")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(patientService.getTotalCount());
    }


    @GetMapping("/hospitalNumber")
    public ResponseEntity<PatientDTO> getPatientByPatientNumberTypeHospitalNumber(@RequestParam String hospitalNumber,
                                                                 @RequestParam (defaultValue = "Hospital Number") String patientNumberType) {
        return ResponseEntity.ok(patientService.getPatientByPatientNumberTypeHospitalNumber(hospitalNumber, patientNumberType));
    }

    @GetMapping("/{hospitalNumber}/exist")
    public ResponseEntity<Boolean> exist(@PathVariable String hospitalNumber) {
        return ResponseEntity.ok(patientService.exist(hospitalNumber));
    }

    @GetMapping("/{id}/identifier-number")
    public ResponseEntity<String> getPatientIdentifierNumber(@PathVariable Long id, @RequestParam String identifierCode) {
        return ResponseEntity.ok(patientService.getPatientIdentifierNumber(id, identifierCode));
    }
  
    @GetMapping("/{id}/encounters/{formCode}")
    public ResponseEntity<List> getEncountersByPatientIdAndFormCode(@PathVariable Long id,
                                                                    @PathVariable String formCode, @RequestParam(required = false) String sortOrder,
                                                                    @RequestParam (required = false) String sortField, @RequestParam(required = false) Integer limit,
                                                                    @PageableDefault(value = 100) Pageable pageable){
        return ResponseEntity.ok(patientService.getEncountersByPatientIdAndFormCode(pageable, id, formCode, sortField, sortOrder, limit));
    }

    @GetMapping("/{id}/encounters/programCodeExclusionList")
    public ResponseEntity<List> getEncountersByPatientIdAndProgramCodeExclusionList(@PathVariable Long id, @RequestParam(required = false) List<String> programCodeExclusionList) {
        return ResponseEntity.ok(patientService.getEncountersByPatientIdAndProgramCodeExclusionList(id, programCodeExclusionList));
    }

    @GetMapping("/{programCode}/registered")
    public ResponseEntity<List> getAllPatientsByProgramCode(@PathVariable String programCode) {
        return ResponseEntity.ok(patientService.getAllPatientsByProgramCode(programCode));
    }

    @GetMapping("/{id}/visits/{dateStart}/{dateEnd}")
    public ResponseEntity<List<VisitDTO>> getVisitByPatientIdAndVisitDate(@PathVariable Optional<Long> id, /*@ApiParam(defaultValue = "",required = false) */@PathVariable(required = false) Optional<String> dateStart,
                                                                          /*@ApiParam(defaultValue = "",required = false)*/ @PathVariable(required = false) Optional <String> dateEnd) {
        return ResponseEntity.ok(patientService.getVisitByPatientIdAndVisitDate(id,dateStart,dateEnd));
    }


    @GetMapping("/{id}/encounters/{formCode}/{dateStart}/{dateEnd}")
    public List getEncountersByPatientIdAndDateEncounter(@PathVariable Long id, @PathVariable String formCode,
                                                         /*@ApiParam(defaultValue = "")*/ @PathVariable(required = false) Optional<String> dateStart,
                                                         /*@ApiParam(defaultValue = "")*/ @PathVariable(required = false) Optional<String> dateEnd) {
        return patientService.getEncountersByPatientIdAndDateEncounter(id, formCode, dateStart, dateEnd);
    }

    @GetMapping("/{id}/encounters")
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

    @GetMapping("/{id}/users")
    public ResponseEntity<UserDTO> getAllApplicationUserByPatientId(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getUserByPatientId(id));
    }
}
