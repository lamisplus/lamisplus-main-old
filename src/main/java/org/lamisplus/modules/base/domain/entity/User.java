package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

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
    @NonNull
    private String password;
    @NonNull
    private Integer active;
    private Date dateCreated;
    private String lastModifiedBy;
    private Date dateLastModified;
    private String activationKey;
    private Date dateReset;
    private String resetKey;
    private Integer uploaded;
    private Time timeUploaded;
    private Long personId;
    @OneToOne
    private Person personByPersonId;
    @OneToMany(mappedBy = "clinicianByUserId")
    private List <ClinicianPatient> clinicianPatientByUser = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<Role> roles;
}