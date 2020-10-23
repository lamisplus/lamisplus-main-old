package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Role> get(@PathVariable Long id) {
        return ResponseEntity.ok(roleRepository.findById(id).get());
    }

    @PostMapping("/{id}/permissions")
    public ResponseEntity<Object[]> updatePermissions(@Valid @RequestBody List<Permission> permissions, @PathVariable Long id) {
        try {
            Role role = roleRepository.findById(id).get();
            HashSet permissionsSet = new HashSet<>();
            Permission permissionToAdd = new Permission();
            for(Permission p : permissions){
                // add permissions by either id or name
                if(null != p.getName()) {
                    permissionToAdd = permissionRepository.findByName(p.getName()).get();
                } else if(p.getId() != null ){
                    permissionToAdd = permissionRepository.findById(p.getId()).get();
                } else {
                    ResponseEntity.badRequest();
                    return null;
                }
                permissionsSet.add(permissionToAdd);
            }
            role.setPermissions(permissionsSet);
            roleService.update(id, role);
            return ResponseEntity.ok(role.getPermissions().toArray());
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
        return null;
    }
}
