package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.RadiologyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/radiologies")
@Slf4j
@RequiredArgsConstructor
public class RadiologyController {
    private final RadiologyService radiologyService;

    @PostMapping
    public ResponseEntity<String> save(@RequestParam Long formId, @RequestParam("file") MultipartFile file, Boolean overrideExistFile) {
        return ResponseEntity.ok(radiologyService.save(formId, file, overrideExistFile));
    }

}
