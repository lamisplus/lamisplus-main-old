package org.lamisplus.modules.base.controller;

import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.controller.vm.ManagedUserVM;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@Audit
public class AccountController {
    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final UserRepository userRepository;

    private final UserService userService;

    public AccountController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/account")
    public UserDTO getAccount(Principal principal){
        return userService
                .getUserWithRoles()
                .map(UserDTO::new)
                .orElseThrow(() -> new AccountResourceException("User could not be found"));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('user_write')")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        //Check Password Length
        userService.registerUser(managedUserVM, managedUserVM.getPassword());
    }




    @GetMapping("/users")
    @PreAuthorize("hasAuthority('user_read')")
    public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) {
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
