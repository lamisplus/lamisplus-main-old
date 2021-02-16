package org.lamisplus.modules.base.service;

import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailService.class);

    @Autowired
    UserRepository userRepository;

    @PersistenceContext
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    private EntityManager entityManager;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        try {
            User user = entityManager
                    .createQuery("SELECT u FROM User u LEFT JOIN FETCH u.role r LEFT JOIN FETCH r.permission p WHERE u.userName = :userName", User.class)
                    .setParameter("userName", userName)
                    .getSingleResult();
            return new UserPrincipal(user);
        } catch (NoResultException e) {
            throw new UsernameNotFoundException("not found");
        }
    }

    /*private User createSecurityUser(String lowercaseUserName, org.lamisplus.modules.base.domain.entity.User user){
        List<GrantedAuthority> grantedAuthorities = user
                .getRoles()
                .stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());
        return new User(user.getUserName(), user.getPassword(), grantedAuthorities);
    }*/
}
