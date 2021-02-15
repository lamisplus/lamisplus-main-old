package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.service.FormDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/form-data")
@Slf4j
@RequiredArgsConstructor
@Audit
public class FormDataController {
    private final FormDataService formDataService;


    @GetMapping
    public ResponseEntity<List<FormData>> getAllFormData() {
        return ResponseEntity.ok(formDataService.getAllFormData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormData> getFormData(@PathVariable Long id) {
        return ResponseEntity.ok(formDataService.getFormData(id));
    }

    @PostMapping
    public ResponseEntity<FormData> save(@RequestBody FormData formData) {
        return ResponseEntity.ok(formDataService.save(formData));

    }

    @PutMapping("{id}")
    public ResponseEntity<FormData> update(@PathVariable Long id, @RequestBody FormData formData) {
        return ResponseEntity.ok(formDataService.update(id, formData));

    }

    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Long id, @RequestBody FormData formData) {
        return this.formDataService.delete(id, formData);
    }
}
