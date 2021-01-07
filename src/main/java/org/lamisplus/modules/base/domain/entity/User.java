package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
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
public class User implements Serializable {
    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String userName;
    private String email;
    private String phoneNumber;
    private String gender;
    @NonNull
    private String password;
    @NonNull
    private Integer active = 1;
    @CreationTimestamp
    private Date dateCreated;
    private String lastModifiedBy;
    @UpdateTimestamp
    private Date dateLastModified;
    private String activationKey;
    private Date dateReset;
    private String resetKey;
    private Integer uploaded;
    private Time timeUploaded;
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
    public List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitsById;

    @OneToMany(mappedBy = "applicationUserByApplicationUserId")
    @JsonIgnore
    public List<ApplicationUserPatient> applicationUserPatientsById;
}