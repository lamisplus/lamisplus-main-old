package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

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
    public Role update(long id, Role role) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        role.setId(id);
        return roleRepository.save(role);
    }
}
