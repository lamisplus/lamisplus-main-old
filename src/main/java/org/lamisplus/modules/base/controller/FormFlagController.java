package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.FormFlagDTO;
import org.lamisplus.modules.base.domain.dto.FormFlagDTOS;
import org.lamisplus.modules.base.domain.entity.FormFlag;
import org.lamisplus.modules.base.service.FormFlagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/form-flags")
@Slf4j
@RequiredArgsConstructor
public class FormFlagController {
    private final FormFlagService formFlagService;

    @GetMapping
    public ResponseEntity<List<FormFlag>> getAllFormFlags() {
        return ResponseEntity.ok(formFlagService.getAllFormFlags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormFlag> getFlag(@PathVariable Long id) {
        return ResponseEntity.ok(formFlagService.getFormFlag(id));
    }

    @PostMapping
    public ResponseEntity<List<FormFlag>> save(@RequestBody FormFlagDTOS formFlagDTOS) {
        return ResponseEntity.ok(formFlagService.save(formFlagDTOS));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormFlag> update(@PathVariable Long id, @RequestBody FormFlag formFlag) {
        return ResponseEntity.ok(formFlagService.update(id, formFlag));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        formFlagService.delete(id);
    }
}
