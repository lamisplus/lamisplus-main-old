package org.lamisplus.modules.base.domain.dto;

import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;

import java.util.Set;
import java.util.stream.Collectors;


public class UserDTO {
    private Long id;
    private String userName;
    //private String password;
    private Set<String> roles;
    private String firstName;
    private String lastName;

    public UserDTO(){}

    public UserDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        this.firstName = user.getPersonByPersonId().getFirstName();
        this.lastName = user.getPersonByPersonId().getLastName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> authorities) {
        this.roles = authorities;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", roles=" + roles +
                '}';
    }
}
