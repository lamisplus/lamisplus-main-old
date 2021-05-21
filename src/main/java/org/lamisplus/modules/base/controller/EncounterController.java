package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.service.EncounterService;
import org.lamisplus.modules.base.domain.dto.EncounterDTO;
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

@RestController
@RequestMapping("/api/encounters")
@Slf4j
@RequiredArgsConstructor
public class EncounterController {
    private final EncounterService encounterService;

    @PostMapping
    public ResponseEntity<Encounter> save(@RequestParam ("formType") Optional<Integer> formType, @RequestBody EncounterDTO encounterDTO) {
        return ResponseEntity.ok(encounterService.save(encounterDTO, formType.orElse(0)));
    }

    @GetMapping
    public ResponseEntity<List<EncounterDTO>> getAllEncounters() {
        return ResponseEntity.ok(this.encounterService.getAllEncounters());
    }

    /*@ApiOperation(value="getEncounterByFormCodeAndDateEncounter", notes = " formCode=required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - api/encounters/{formCode}?dateStart=01-01-2020&dateEnd=01-04-2020")*/
    @GetMapping("/{formCode}/{dateStart}/{dateEnd}")
    public ResponseEntity<List<EncounterDTO>> getEncounterByFormCodeAndDateEncounter(@PathVariable String formCode,
                                                                 /*@ApiParam(defaultValue = "")*/ @PathVariable(required = false) Optional<String> dateStart,
                                                                                     /*@ApiParam(value = "")*/ @PathVariable(required = false) Optional<String> dateEnd,
                                                                                     @RequestParam (required = false, defaultValue = "%*%")String searchValue,
                                                                                     @PageableDefault(value = 100) Pageable pageable) {

        Page<Encounter> page;
        /*if(!searchValue.equals("%*%")) {
            String firstName = "%"+searchValue+"%";
            String lastName = "%"+searchValue+"%";
            String hospitalNumber = "%"+searchValue+"%";
            page = encounterService.findAllPages(firstName, lastName,hospitalNumber, pageable);
        }*/
        page = encounterService.getEncounterByFormCodeAndDateEncounter(formCode, dateStart, dateEnd, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(encounterService.getAllEncounters(page), headers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncounterDTO> getEncounter(@PathVariable Long id) {
        return ResponseEntity.ok(this.encounterService.getEncounter(id));
    }

    @GetMapping("/{id}/form-data")
    public ResponseEntity<List> getFormDataByEncounterId(@PathVariable Long id) {
        return ResponseEntity.ok(this.encounterService.getFormDataByEncounterId(id));
    }

    @GetMapping("/{programCode}/totalCount")
    public ResponseEntity<Long> getTotalCount(@PathVariable String programCode) {
        return ResponseEntity.ok(this.encounterService.getTotalCount(programCode));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Encounter> update(@PathVariable Long id, @RequestBody EncounterDTO encounterDTO){
        return ResponseEntity.ok(this.encounterService.update(id, encounterDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.encounterService.delete(id));
    }

}
