package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "patient")
public class Patient implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "date_registration", nullable = false)
    @NotNull
    private LocalDate dateRegistration;

    @Basic
    @Column(name = "facility_id", insertable = false, updatable = false)
    private Long facilityId = 1L;

    @Basic
    @Column(name = "person_id")
    private Long personId;

    @Basic
    @Column(name = "patient_number")
    private String hospitalNumber;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived")
    private Integer archived = 0;

    /*@ManyToOne
    @JoinColumn(name = "facility_id", referencedColumnName = "id")
    @JsonIgnore
    private Facility facilityByFacilityId;*/

    @Basic
    @Column(name = "organisation_unit_id")
    private Long organisationUnitId;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Person personByPersonId;

    @OneToMany(mappedBy = "patientByVisit")
    @JsonIgnore
    @ToString.Exclude
    private List<Visit> visitsByPatient;

    @OneToMany(mappedBy = "patientByPatientId")
    @JsonIgnore
    @ToString.Exclude
    private List<Encounter> encountersByPatient;

    @OneToMany(mappedBy = "patientByPatientId")
    @JsonIgnore
    @ToString.Exclude
    private List<ClinicianPatient> clinicianByPatient;

    @OneToMany(mappedBy = "patientByPatientId")
    public List<ApplicationUserPatient> getApplicationUserPatientsById;
}
