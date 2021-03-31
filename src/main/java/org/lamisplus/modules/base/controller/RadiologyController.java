package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.service.RadiologyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


@RestController
@Slf4j
@RequiredArgsConstructor
@Audit
public class RadiologyController {
    private final RadiologyService radiologyService;

    @PostMapping("/api/radiologies")
    public ResponseEntity<Long> save(@RequestParam Long formId, @RequestBody FormData formData, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(radiologyService.save(formId, formData, file));
    }
}
