package org.lamisplus.modules.base.base.controller;


import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.base.domain.dto.ProgramDTO;
import org.lamisplus.modules.base.base.domain.entity.Form;
import org.lamisplus.modules.base.base.domain.entity.Program;
import org.lamisplus.modules.base.base.service.ProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/programs")
public class ProgramController {
    private final String ENTITY_NAME = "Program";
    private final ProgramService programService;

    @PostMapping
    public ResponseEntity<Program> save(@RequestBody ProgramDTO programDTO) throws URISyntaxException {
        Program program = this.programService.save(programDTO);
        return ResponseEntity.created(new URI("/api/programs/" + program.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(program.getId()))).body(program);
    }

    @PutMapping
    public ResponseEntity<Program> update(@PathVariable Long id, @RequestBody ProgramDTO programDTO) throws URISyntaxException {
        Program program = this.programService.update(id, programDTO);
        return ResponseEntity.created(new URI("/api/programs/" + program.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(program.getId()))).body(program);
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
