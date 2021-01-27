package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.GlobalVariableDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.GlobalVariable;
import org.lamisplus.modules.base.service.GlobalVariableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/global-variables")
@Slf4j
@RequiredArgsConstructor
@Audit
public class GlobalVariableController {
    private final GlobalVariableService globalVariableService;

    @PostMapping
    public ResponseEntity<GlobalVariable> save(@RequestBody GlobalVariableDTO globalVariableDTO) {
        return ResponseEntity.ok(this.globalVariableService.save(globalVariableDTO));

    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalVariable> update(@PathVariable Long id, @RequestBody GlobalVariableDTO globalVariableDTO) {
        return ResponseEntity.ok(this.globalVariableService.update(id, globalVariableDTO));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.globalVariableService.delete(id));
    }

    @GetMapping
    public ResponseEntity<List<GlobalVariable>> getAllGlobalVariables() {
        return ResponseEntity.ok(this.globalVariableService.getGlobalVariables());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<GlobalVariable> getGlobalVariables(@PathVariable Long id) {
        return ResponseEntity.ok(this.globalVariableService.getGlobalVariable(id));
    }

}
