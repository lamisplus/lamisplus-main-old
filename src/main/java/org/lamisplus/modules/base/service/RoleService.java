package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @PersistenceContext
    EntityManager em;

    public Role save(Role role) {
        Optional<Role> RoleOptional = roleRepository.findByName(role.getName());
        if (RoleOptional.isPresent()) throw new RecordExistException(Role.class, "Name", role.getName());
        return roleRepository.save(role);
    }

    public Role get(Long id) {
        Optional<Role> roleOptional = this.roleRepository.findById(id);
        if (!roleOptional.isPresent()) throw new EntityNotFoundException(Role.class, "Id", id + "");
        return roleOptional.get();
    }
    public Role updatePermissions(long id, List<Permission> permissions) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        Role updatedRole = roleOptional.get();
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
        updatedRole.setPermissions(permissionsSet);
        return roleRepository.save(updatedRole);
    }
}
