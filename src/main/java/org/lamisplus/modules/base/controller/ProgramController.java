package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.ProgramDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.service.ProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/programs")
@Audit
public class ProgramController {
    private final String ENTITY_NAME = "Program";
    private final ProgramService programService;

    @PostMapping
    public ResponseEntity<Program> save(@RequestBody ProgramDTO programDTO) {
        return ResponseEntity.ok(this.programService.save(programDTO));
    }

    @PutMapping("/{id}")
    public Program update(@PathVariable Long id, @RequestBody ProgramDTO programDTO) {
        return programService.update(id, programDTO);
    }

    @GetMapping("{id}/forms")
    public ResponseEntity<List<Form>> getFormByProgramId(@PathVariable Long id) {
            return ResponseEntity.ok(this.programService.getFormByProgramId(id));
    }

    @GetMapping
    public ResponseEntity<List<Program>> getAllPrograms() {
        return ResponseEntity.ok(this.programService.getAllPrograms());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.programService.delete(id));
    }
}
