package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

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
public class Patient extends JsonBEntity implements Serializable {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*@Basic
    @Column(name = "date_registration")
    @NotNull
    private LocalDate dateRegistration;*/
    /*@Basic
    @Column(name = "person_id")
    private Long personId;*/
    @Basic
    @Column(name = "patient_number")
    private String hospitalNumber;

    @Basic
    @Column(name = "uuid", updatable = false)
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "archived")
    private Integer archived = 0;

    @Basic
    @Column(name = "organisation_unit_id", updatable = false)
    @JsonIgnore
    private Long organisationUnitId;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "details", nullable = false, columnDefinition = "jsonb")
    private Object details;

    /*@ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Person personByPersonId;*/

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

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private String createdBy;

    @CreatedDate
    @Column(name = "date_created", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Timestamp dateCreated;

    @LastModifiedBy
    @Column(name = "modified_by")
    @JsonIgnore
    @ToString.Exclude
    private String modifiedBy;

    @LastModifiedDate
    @Column(name = "date_modified")
    @JsonIgnore
    @ToString.Exclude
    private Timestamp dateModified;
}
