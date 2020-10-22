package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
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

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).map(UserDTO::new).get());
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<Object[]> updateRoles(@Valid @RequestBody List<Role> roles, @PathVariable Long id) {
        try {
            User user = userRepository.findById(id).get();
            HashSet rolesSet = new HashSet<>();
            for(Role r : roles){
                rolesSet.add(r);
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
