package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/modules")
public class ModuleController {
    private final String ENTITY_NAME = "Module";
    private final ModuleService moduleService;


    @GetMapping
    public ResponseEntity<List<Module>> getAllModule() {
        return ResponseEntity.ok(this.moduleService.getAllModules());
    }

    @GetMapping("{moduleStatus}")
    public ResponseEntity<List<Module>> getAllModuleByModuleStatus(@PathVariable int moduleStatus) {
        return ResponseEntity.ok(this.moduleService.getAllModuleByModuleStatus(moduleStatus));
    }

    @PostMapping
    public ResponseEntity<Module> save(@RequestBody ModuleDTO moduleDTO) throws URISyntaxException {
        Module module = this.moduleService.save(moduleDTO);
        return ResponseEntity.created(new URI("/api/modules/" + module.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(module.getId()))).body(module);
    }

    @PostMapping("/upload")
    public ResponseEntity<List<Module>> uploadAndUnzip(@RequestParam("file1") MultipartFile [] jarFile,
                                                  Boolean overrideExistFile) {
        return ResponseEntity.ok(moduleService.uploadAndUnzip(jarFile, overrideExistFile));
    }

    @PostMapping("{id}/install")
    public ResponseEntity<Module> installModule(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.loadModule(id));
    }

    @PostMapping("/start/all")
    public void startModule() {
        moduleService.startModule();
    }

}
