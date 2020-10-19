package org.lamisplus.modules.base.service;

import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.RoleRepository;
import org.lamisplus.modules.base.repository.PersonRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.security.AuthoritiesConstants;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        return userRepository.findOneWithAuthoritiesByUserName(userName);
    }

    @Transactional(readOnly = true)
    public  Optional<User> getUserWithAuthorities(){
       return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByUserName);
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
        Person newPerson = personRepository.save(person);


        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setUserName(userDTO.getUserName());
        newUser.setPassword(encryptedPassword);
        newUser.setPersonByPersonId(newPerson);
        newUser.setPersonId(newPerson.getId());
        Set<Role> roles = new HashSet<>();
        roleRepository.findById(AuthoritiesConstants.USER).ifPresent(roles::add);
        newUser.setRoles(roles);
        userRepository.save(newUser);
        log.debug("User Created: {}", newUser);
        return newUser;
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserDTO::new);
    }


}

class UsernameAlreadyUsedException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public UsernameAlreadyUsedException() {
        super("Login name already used!");
    }
}
