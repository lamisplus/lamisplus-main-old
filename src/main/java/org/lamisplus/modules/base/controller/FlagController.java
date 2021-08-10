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
@RequestMapping("/api/flags")
@Slf4j
@RequiredArgsConstructor
public class FlagController {
    private final FormFlagService formFlagService;

    @GetMapping
    public ResponseEntity<List<FormFlagDTOS>> getAllFlags() {
        return ResponseEntity.ok(formFlagService.getAllFlags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormFlagDTOS> getFlagById(@PathVariable Long id) {
        return ResponseEntity.ok(formFlagService.getFlagById(id));
    }

    @PostMapping
    public ResponseEntity<List<FormFlag>> save(@RequestBody FormFlagDTOS formFlagDTOS) {
        return ResponseEntity.ok(formFlagService.save(formFlagDTOS));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormFlagDTOS> update(@PathVariable Long id, @RequestBody FormFlagDTOS formFlagDTOS) {
        return ResponseEntity.ok(formFlagService.update(id, formFlagDTOS));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        formFlagService.delete(id);
    }
}
