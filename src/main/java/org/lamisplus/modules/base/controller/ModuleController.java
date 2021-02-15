package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.audit4j.core.annotation.IgnoreAudit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/modules")
@Audit
public class ModuleController {
    private final ModuleService moduleService;
    private static final Boolean IS_START_UP = false;


    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(this.moduleService.getAllModules());
    }

    @GetMapping("{moduleType}")
    public ResponseEntity<List<Module>> getAllModulesByModuleStatus(@PathVariable int moduleType) {
        return ResponseEntity.ok(this.moduleService.getAllModuleByModuleStatus(moduleType));
    }

    @GetMapping("{moduleStatus}/{batchNo}")
    public ResponseEntity<List<Module>> getAllModulesByModuleStatusAndBatchNo(@PathVariable int moduleStatus,
                                                                             @PathVariable String batchNo) {
        return ResponseEntity.ok(this.moduleService.getAllModuleByModuleStatusAndBatchNo(moduleStatus, batchNo));
    }

    @PostMapping
    public ResponseEntity<Module> save(@RequestBody ModuleDTO moduleDTO) {
        return ResponseEntity.ok(this.moduleService.save(moduleDTO));
    }

    @PostMapping("/upload")
    public ResponseEntity<List<Module>> uploadAndUnzip(@IgnoreAudit @RequestParam("file1") MultipartFile [] jarFile, @IgnoreAudit HttpServletRequest request) {
        return ResponseEntity.ok(moduleService.uploadAndUnzip(jarFile, request));
    }

    @PostMapping("{id}/install")
    public ResponseEntity<Module> installModule(@IgnoreAudit @PathVariable Long id) {
        return ResponseEntity.ok(moduleService.installModule(id, null));
    }

    @PostMapping("/start/all")
    public void startModule() {
        moduleService.startModule(IS_START_UP);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.delete(id));
    }

    //TODO: CREATE endpoint for getting all external module only

}
