package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.FlagDTO;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.service.FlagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flags")
@Slf4j
@RequiredArgsConstructor
public class FlagController {
    private final FlagService flagService;

    @GetMapping
    public ResponseEntity<List<FlagDTO>> getAllFlags() {
        return ResponseEntity.ok(flagService.getAllFlags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlagDTO> getFlag(@PathVariable Long id) {
        return ResponseEntity.ok(flagService.getFlag(id));
    }

    @PostMapping
    public ResponseEntity<Flag> save(@RequestBody FlagDTO flagDTO) {
        return ResponseEntity.ok(flagService.save(flagDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flag> update(@PathVariable Long id, @RequestBody FlagDTO flagDTO) {
        return ResponseEntity.ok(flagService.update(id, flagDTO));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        flagService.delete(id);
    }
}
