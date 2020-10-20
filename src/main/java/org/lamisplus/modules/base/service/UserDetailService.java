package org.lamisplus.modules.base.service;

import org.lamisplus.modules.base.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailService.class);

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        log.debug("Authenticating {}", userName);

        String lowercaseUserName = userName.toLowerCase();
        return userRepository
                .findOneWithRolesByUserName(lowercaseUserName)
                .map(user -> createSecurityUser(lowercaseUserName, user))
                .orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseUserName + "was not found"));

        /*SimpleGrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ADMIN");
        List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
        authorities.add(grantedAuthority);
        return new User("abc@mail.com","12345", authorities);*/
    }

    private User createSecurityUser(String lowercaseUserName, org.lamisplus.modules.base.domain.entity.User user){
        List<GrantedAuthority> grantedAuthorities = user
                .getRoles()
                .stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());
        return new User(user.getUserName(), user.getPassword(), grantedAuthorities);
    }
}
