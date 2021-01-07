package org.lamisplus.modules.base.service;

import org.apache.commons.lang3.math.NumberUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.repository.PersonRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.security.RolesConstants;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


@Service
@Transactional
public class UserService {

    @Autowired
    private PersonRepository personRepository;

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public Optional<User> getUserWithAuthoritiesByUsername(String userName){
        return userRepository.findOneWithRoleByUserName(userName);
    }

    @Transactional(readOnly = true)
    public  Optional<User> getUserWithRoles(){
       return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithRoleByUserName);
    }

    public User registerUser(UserDTO userDTO, String password){
        userRepository
                .findOneByUserName(userDTO.getUserName().toLowerCase())
                .ifPresent(existingUser-> {
                    throw new UsernameAlreadyUsedException();
                        }
                );
        Person person = new Person();
        person.setUuid(UuidGenerator.getUuid());
        person.setFirstName(userDTO.getFirstName());
        person.setLastName(userDTO.getLastName());
        person.setDob(userDTO.getDateOfBirth());
        Person newPerson = personRepository.save(person);


        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setUserName(userDTO.getUserName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPhoneNumber(userDTO.getPhoneNumber());
        newUser.setGender(userDTO.getGender());
        newUser.setCurrentOrganisationUnitId(userDTO.getCurrentOrganisationUnitId());
        newUser.setPassword(encryptedPassword);
        newUser.setPerson(newPerson);
        newUser.setPersonId(newPerson.getId());

        if (userDTO.getRoles() == null || userDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            Role role = roleRepository.findAll().stream()
                    .filter(name -> RolesConstants.USER.equals(name.getName()))
                    .findAny()
                    .orElse(null);
            if(role !=null)
                roles.add(role);
            newUser.setRole(roles);
        } else {
            newUser.setRole(getRolesFromStringSet(userDTO.getRoles()));
        }

        //newUser.applicationUserOrganisationUnitsById

        userRepository.save(newUser);
        log.debug("User Created: {}", newUser);
        return newUser;
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserDTO::new);
    }

    public User update(Long id, User user) {
        Optional<User> optionalUser = userRepository.findById(id);
        if(!optionalUser.isPresent())throw new EntityNotFoundException(User.class, "Id", id +"");
        user.setId(id);
        return userRepository.save(user);
    }

    private HashSet<Role> getRolesFromStringSet(Set<String> roles) {
        HashSet roleSet = new HashSet<>();
        Role roleToAdd = new Role();
        for(String r : roles){
            // add roles by either id or name
            if(null != r) {
                roleToAdd = roleRepository.findByName(r).get();
                if (null == roleToAdd && NumberUtils.isParsable(r))
                    roleToAdd = roleRepository.findById(Long.valueOf(r)).get();
            } else {
                ResponseEntity.badRequest();
                return null;
            }
            roleSet.add(roleToAdd);
        }
        return roleSet;
    }


}

class UsernameAlreadyUsedException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public UsernameAlreadyUsedException() {
        super("Login name already used!");
    }
}
