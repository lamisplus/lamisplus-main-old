package org.lamisplus.modules.base.controller;

import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.service.EncounterService;
import org.lamisplus.modules.base.domain.dto.EncounterDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/encounters")
@Slf4j
@RequiredArgsConstructor
@Audit
public class EncounterController {
    //private static String ENTITY_NAME = "Encounter";
    private final EncounterService encounterService;

    @PostMapping
    public ResponseEntity<Encounter> save(@RequestBody EncounterDTO encounterDTO) {
        return ResponseEntity.ok(encounterService.save(encounterDTO));
    }

    @ApiOperation(value="getAllEncounters", notes = "response is List of EncounterDTO\n\n" +
            "Example - /api/encounters")
    @GetMapping
    public ResponseEntity<List<EncounterDTO>> getAllEncounters() {
        return ResponseEntity.ok(this.encounterService.getAllEncounters());
    }

    @ApiOperation(value="getEncounterByFormCodeAndDateEncounter", notes = " formCode=required, dateStart=optional, dateEnd=optional\n\n" +
            "Example - api/encounters/{formCode}?dateStart=01-01-2020&dateEnd=01-04-2020")
    @GetMapping("/{formCode}/{dateStart}/{dateEnd}")
    public ResponseEntity<List<EncounterDTO>> getEncounterByFormCodeAndDateEncounter(@PathVariable String formCode,
                                                                 @ApiParam(defaultValue = "",required = false) @PathVariable(required = false) Optional<String> dateStart,
                                                                            @ApiParam(value = "", required = false) @PathVariable(required = false) Optional<String> dateEnd) {
        return ResponseEntity.ok(this.encounterService.getEncounterByFormCodeAndDateEncounter(formCode, dateStart, dateEnd));
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
