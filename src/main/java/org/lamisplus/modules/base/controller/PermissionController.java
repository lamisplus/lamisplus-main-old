package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Audit
public class PermissionController {
    private final PermissionRepository permissionRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('user_read')")
    public ResponseEntity<List<Permission>> getAll() {
        return ResponseEntity.ok(this.permissionRepository.findAll());
    }


    @PostMapping
    @PreAuthorize("hasAuthority('user_write')")
    public ResponseEntity<List<Permission>> save(@RequestBody List<Permission> permissions) {
        return ResponseEntity.ok(this.permissionRepository.saveAll(permissions));
    }
}
