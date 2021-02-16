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
import java.util.Collection;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "patient")
public class Patient extends Audit<String> implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "date_registration", nullable = false)
    @NotNull
    private LocalDate dateRegistration;
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
    @Column(name = "archived")
    private Integer archived = 0;

    @Basic
    @Column(name = "organisation_unit_id")
    @JsonIgnore
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
    public List<ApplicationUserPatient> applicationUserPatientsById;

    @OneToMany(mappedBy = "patientByPatientId")
    @JsonIgnore
    @ToString.Exclude
    public List<Appointment> appointmentsById;
}
