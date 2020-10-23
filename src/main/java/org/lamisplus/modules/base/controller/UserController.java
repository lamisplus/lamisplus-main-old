package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).map(UserDTO::new).get());
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<Object[]> updateRoleByName(@Valid @RequestBody List<Role> roles, @PathVariable Long id) {
        try {
            User user = userRepository.findById(id).get();
            HashSet rolesSet = new HashSet<>();
            Role roleToAdd = new Role();
            for(Role r : roles){
                // add roles by either id or name
                if(r.getName() != null ) {
                    roleToAdd = roleRepository.findByName(r.getName()).get();
                } else if(r.getId() != null ){
                    roleToAdd = roleRepository.findById(r.getId()).get();
                } else {
                    ResponseEntity.badRequest();
                    return null;
                }
                rolesSet.add(roleToAdd);
            }
            user.setRoles(rolesSet);
            userService.update(id, user);
            return ResponseEntity.ok(user.getRoles().toArray());
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
        return null;
    }


}
