package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.service.FormService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;



@RestController
@RequestMapping("/api/forms")
@Slf4j
@RequiredArgsConstructor
@Audit
public class FormController {
    private final FormService formService;

    @GetMapping
    public ResponseEntity<List<FormDTO>> getAllForms() {
            return ResponseEntity.ok(this.formService.getAllForms());
    }

    @GetMapping ("/{formCode}/formCode")
    public ResponseEntity<Form> getFormsByFormCode(@PathVariable String formCode) {
            return ResponseEntity.ok(this.formService.getFormsByFormCode(formCode));
    }

    @GetMapping ("/{id}")
    public ResponseEntity<Form> getForm(@PathVariable Long id) {
        return ResponseEntity.ok(this.formService.getForm(id));
    }

    @GetMapping ("/{usageCode}/usageCode")
    public ResponseEntity<List> getFormsByUsageStatus(@PathVariable Integer usageCode) {
        return ResponseEntity.ok(this.formService.getFormsByUsageStatus(usageCode));
    }

    @PostMapping
    public ResponseEntity<Form> save(@RequestBody FormDTO formDTO) {
        return ResponseEntity.ok(this.formService.save(formDTO));

    }

    @PutMapping("/{id}")
    public ResponseEntity<Form> update(@PathVariable Long id, @RequestBody FormDTO formDTO) {
        return ResponseEntity.ok(this.formService.update(id, formDTO));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.formService.delete(id));
    }
}
