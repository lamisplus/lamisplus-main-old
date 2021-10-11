package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class FormDataController {
    private final FormDataService formDataService;
    private static final String ENTITY_NAME = "FormData";


    @GetMapping
    public ResponseEntity<List<FormData>> getAllFormData() {
        return ResponseEntity.ok(formDataService.getAllFormData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormData> getFormData(@PathVariable Long id) {
        return ResponseEntity.ok(formDataService.getFormData(id));
    }

    @PostMapping
    public ResponseEntity<FormData> save(@RequestBody FormData formData) throws URISyntaxException {
        FormData result = formDataService.save(formData);
        return ResponseEntity.created(new URI("/api/form-data/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<FormData> update(@PathVariable Long id, @RequestBody FormData formData) throws URISyntaxException {
        FormData result = formDataService.update(id, formData);
        return ResponseEntity.created(new URI("/api/form-data/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Long id, @RequestBody FormData formData) {
        return this.formDataService.delete(id, formData);
    }
}
