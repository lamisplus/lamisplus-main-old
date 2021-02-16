package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "application_user")
@DynamicUpdate
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "user_name")
    @NonNull
    private String userName;

    @Basic
    @Column(name = "email")
    private String email;

    @Basic
    @Column(name = "phone_number")
    private String phoneNumber;

    @Basic
    @Column(name = "gender")
    private String gender;

    @Basic
    @Column(name = "password")
    @NonNull
    private String password;

    @Basic
    @Column(name = "active")
    @NonNull
    private Integer active = 1;

    @Basic
    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Basic
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Basic
    @Column(name = "date_last_modified")
    @UpdateTimestamp
    private Date dateLastModified;

    @Basic
    @Column(name = "activation_key")
    private String activationKey;

    @Basic
    @Column(name = "date_reset")
    private Date dateReset;

    @Basic
    @Column(name = "reset_key")
    private String resetKey;

    @Basic
    @Column(name = "uploaded")
    private Integer uploaded;

    @Basic
    @Column(name = "time_uploaded")
    private Time timeUploaded;

    @Basic
    @Column(name = "current_organisation_unit_id")
    private Long currentOrganisationUnitId;

    @Basic
    @Column(name = "person_id")
    private Long personId;

    @OneToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Person person;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<Role> role;

    @OneToMany(mappedBy = "applicationUserByApplicationUserId", cascade = CascadeType.PERSIST)
    private List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnits;

    @OneToMany(mappedBy = "applicationUserByApplicationUserId")
    @JsonIgnore
    @ToString.Exclude
    private List<ApplicationUserPatient> applicationUserPatientsById;

    @ManyToOne
    @JoinColumn(name = "current_organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ToString.Exclude
    private OrganisationUnit organisationUnitByCurrentOrganisationUnitId;
}