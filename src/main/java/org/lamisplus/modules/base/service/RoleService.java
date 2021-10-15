package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.RoleDTO;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.repository.ApplicationUserPatientRepository;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.repository.UserRepository;
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
    private static final int UN_ARCHIVED = 0;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private final UserMapper userMapper;

    @PersistenceContext
    EntityManager em;

    public Role save(RoleDTO roleDTO) throws Exception{
        Optional<Role> RoleOptional = roleRepository.findByName(roleDTO.getName());
        if (RoleOptional.isPresent()) throw new RecordExistException(Role.class, "Name", roleDTO.getName());
        try{
            Role role = new Role();
            role.setName(roleDTO.getName());
            HashSet<Permission> permissions = getPermissions(roleDTO.getPermissions());
            role.setPermission(permissions);
            return roleRepository.save(role);
        } catch (Exception e) {
            throw  e;
        }
    }

    public Role get(Long id) {
        Optional<Role> roleOptional = this.roleRepository.findById(id);
        if (!roleOptional.isPresent()) throw new EntityNotFoundException(Role.class, "Id", id + "");
        return roleOptional.get();
    }

    public Role updateName(long id, String name) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        Role updatedRole = roleOptional.get();
        updatedRole.setName(name);
        return roleRepository.save(updatedRole);
    }

    public Role updatePermissions(long id, List<Permission> permissions) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        Role updatedRole = roleOptional.get();
        HashSet<Permission> permissionsSet = getPermissions(permissions);
        updatedRole.setPermission(permissionsSet);
        return roleRepository.save(updatedRole);
    }

    private HashSet<Permission> getPermissions(List<Permission> permissions) {
        HashSet permissionsSet = new HashSet<>();
        Permission permissionToAdd = new Permission();
        for(Permission p : permissions){
            try {
                // add permissions by either id or name
                if (null != p.getName()) {
                    permissionToAdd = permissionRepository.findByNameAndArchived(p.getName(), UN_ARCHIVED).get();
                }  else {
                    ResponseEntity.badRequest();
                    return null;
                }
                permissionsSet.add(permissionToAdd);
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return permissionsSet;
    }

    @Transactional
    public List<UserDTO> getAllUsersByRoleId(Long id, String programCode){
        HashSet<Role> roles = new HashSet<>();
        Role role = roleRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(Role.class, "id", ""+id));
        roles.add(role);
        userRepository.findAllByRoleIn(roles).forEach(user -> {
            if(!programCode.equalsIgnoreCase("*")) {
                user.setManagedPatientCount(applicationUserPatientRepository.findCountOfPatientManagedByUserInASpecificProgram(user.getId(), programCode, UN_ARCHIVED));
            } else {
                user.setManagedPatientCount(applicationUserPatientRepository.findCountOfPatientManagedByUserInAllProgram(user.getId(), UN_ARCHIVED));
            }
        });

        //TODO: find by user in organisation Unit...
        return userMapper.usersToUserDTOs(userRepository.findAllByRoleIn(roles));
    }
}
