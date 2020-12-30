package org.lamisplus.modules.base.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String userName;
    private Set<String> roles;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private Long currentOrganisationUnitId;
    private List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitsById;


    public UserDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        this.firstName = user.getPerson().getFirstName();
        this.lastName = user.getPerson().getLastName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.gender = user.getGender();
        this.dateOfBirth = user.getPerson().getDob();
        this.currentOrganisationUnitId = user.getCurrentOrganisationUnitId();
        this.applicationUserOrganisationUnitsById = user.applicationUserOrganisationUnitsById;

    }


    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", gender='" + gender + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", currentOrganisationUnitId='" + currentOrganisationUnitId + '\'' +
                ", roles=" + roles + '\'' +
                ", applicationUserOrganisationUnitsById=" + applicationUserOrganisationUnitsById +
                '}';
    }
}
