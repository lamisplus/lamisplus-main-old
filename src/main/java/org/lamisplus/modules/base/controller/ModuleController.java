package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.service.ModuleService;
import org.lamisplus.modules.base.service.ModuleStorageService;
import org.lamisplus.modules.base.util.module.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/modules")
public class ModuleController {
    private final String ENTITY_NAME = "Module";
    private final ModuleService moduleService;

    @PostMapping
    public ResponseEntity<Module> save(@RequestBody ModuleDTO moduleDTO) throws URISyntaxException {
        Module module = this.moduleService.save(moduleDTO);
        return ResponseEntity.created(new URI("/api/modules/" + module.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(module.getId()))).body(module);
    }

    @GetMapping
    public ResponseEntity<List<Module>> getAllModule() {
        return ResponseEntity.ok(this.moduleService.getAllModules());
    }

    @PostMapping("/bootstrap")
    public ResponseEntity<Module> bootstrap(@RequestParam("file") MultipartFile file, Boolean overrideExistFile) {
        return ResponseEntity.ok(moduleService.bootstrap(file, overrideExistFile));
    }
}
