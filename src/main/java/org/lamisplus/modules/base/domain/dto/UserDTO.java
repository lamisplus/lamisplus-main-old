package org.lamisplus.modules.base.domain.dto;



import org.lamisplus.modules.base.domain.entity.Authority;
import org.lamisplus.modules.base.domain.entity.User;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;


public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phoneNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private String organizationalUnit;
    //private String password;
    private Set<String> authorities;


    public UserDTO(){}

    public UserDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.gender = user.getGender();
        this.organizationalUnit = user.getOrganizationalUnit();
        this.authorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet());
        this.firstName = user.getPersonByPersonId().getFirstName();
        this.lastName = user.getPersonByPersonId().getLastName();
        this.dateOfBirth = user.getPersonByPersonId().getDateofBirth();

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

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public String getOrganizationalUnit() {
        return organizationalUnit;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", authorities=" + authorities +
                '}';
    }
}
