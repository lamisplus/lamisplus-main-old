package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionRegistry;
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
    private final SessionRegistry sessionRegistry;
    //private final MyLogoutSuccessHandler logoutSuccessHandler;


    @GetMapping("/{id}")
    //@PreAuthorize("hasAuthority('user_read')")
    public ResponseEntity<UserDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).map(UserDTO::new).get());
    }

    @PostMapping("/{id}/roles")
    //@PreAuthorize("hasAuthority('user_write')")
    public ResponseEntity<Object[]> updateRoles(@Valid @RequestBody List<Role> roles, @PathVariable Long id) throws Exception {
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
            user.setRole(rolesSet);
            userService.update(id, user);
            return ResponseEntity.ok(user.getRole().toArray());
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/roles/{roleId}")
    //@PreAuthorize("hasAuthority('user_read')")
    public ResponseEntity<List<UserDTO>> getAllUserByRole(@PathVariable Long roleId) {
        return ResponseEntity.ok(userService.getAllUserByRole(roleId));
    }

    @PostMapping("/organisationUnit/{id}")
    public ResponseEntity<UserDTO> getAllUsers(@PathVariable Long id) {
        UserDTO userDTO = userService
                .getUserWithRoles()
                .map(UserDTO::new)
                .orElseThrow(() -> new EntityNotFoundException(User.class, "Not Found", ""));
        return ResponseEntity.ok(userService.changeOrganisationUnit(id, userDTO));
    }

    @GetMapping("/loggedInCount")
    public Integer getNumberOfLoggedInUsers() {
        final List<Object> allPrincipals = sessionRegistry.getAllPrincipals();
        return  allPrincipals.size();

        /*for(final Object principal : allPrincipals) {
            if(principal instanceof UserPrincipal) {
                final UserPrincipal user = (UserPrincipal) principal;
                // Do something with user
                System.out.println(user);
            }
        }*/
    }

/*@PostMapping("/logOut")
public void logOut(HttpServletRequest request,
                      HttpServletResponse response, Authentication authentication) {
    try {
        logoutSuccessHandler.onLogoutSuccess(request, response, authentication);
    } catch (IOException | ServletException e) {
        e.printStackTrace();
    }
}*/
}
