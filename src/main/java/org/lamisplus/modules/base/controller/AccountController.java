package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.vm.ManagedUserVM;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {
    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final UserRepository userRepository;

    private final UserService userService;

    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;

    /*public AccountController(UserRepository userRepository, UserService userService, ApplicationUserOrganisationUnitService applicationUserOrganisationUnitService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.applicationUserOrganisationUnitService = applicationUserOrganisationUnitService;
    }*/

    @GetMapping("/account")
    public UserDTO getAccount(Principal principal){
        UserDTO userDTO =  userService
                .getUserWithRoles()
                .map(UserDTO::new)
                .orElseThrow(() -> new AccountResourceException("User could not be found"));

        User user = userRepository.getOne(userDTO.getId());

        if(userDTO.getCurrentOrganisationUnitId() == null && !userDTO.getApplicationUserOrganisationUnits().isEmpty()){
            for (ApplicationUserOrganisationUnit applicationUserOrganisationUnit : userDTO.getApplicationUserOrganisationUnits()) {
                user.setCurrentOrganisationUnitId(applicationUserOrganisationUnit.getOrganisationUnitId());
                userRepository.save(user);
                break;
            }
        }
        Optional<ApplicationUserOrganisationUnit> optionalApplicationUserOrganisationUnit = applicationUserOrganisationUnitRepository.findByApplicationUserIdAndOrganisationUnitIdAndArchived(user.getId(), user.getCurrentOrganisationUnitId(), 0);

        if(!optionalApplicationUserOrganisationUnit.isPresent()){
            Set<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitSet = new HashSet<>();
            ApplicationUserOrganisationUnit applicationUserOrganisationUnit = new ApplicationUserOrganisationUnit();
            applicationUserOrganisationUnit.setApplicationUserId(user.getId());
            applicationUserOrganisationUnit.setOrganisationUnitId(user.getCurrentOrganisationUnitId());
            applicationUserOrganisationUnitSet.add(applicationUserOrganisationUnit);
            applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
        }
        return userDTO;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        //Check Password Length
        userService.registerUser(managedUserVM, managedUserVM.getPassword(), false);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) {
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
}
