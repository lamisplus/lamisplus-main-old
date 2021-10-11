package org.lamisplus.modules.base.controller;

import org.lamisplus.modules.base.controller.vm.ManagedUserVM;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.security.AuthoritiesConstants;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AccountController {
    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(AccountController.class);

    private final UserRepository userRepository;

    private final UserService userService;

    public AccountController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/account")
    public UserDTO getAccount(){
        return userService
                .getUserWithAuthorities()
                .map(UserDTO::new)
                .orElseThrow(() -> new AccountResourceException("User could not be found"));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        //Check Password Length
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) {
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
