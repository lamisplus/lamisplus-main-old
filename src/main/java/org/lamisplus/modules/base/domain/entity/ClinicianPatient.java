package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "clinician_patient")
public class ClinicianPatient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @Basic
    @Column(name = "visit_id")
    private Long visitId;

    @Basic
    @Column(name = "patient_id")
    private Long patientId;

    @Basic
    @Column(name = "clinician_id")
    private Long clinicianId;

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
    @UpdateTimestamp
    @JsonIgnore
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived", nullable = true)
    @JsonIgnore
    private Integer archived = 0;

    @Basic
    @Column(name = "uuid", nullable = true)
    private String uuid;

    @JoinColumn(name = "visit_id", insertable = false, updatable = false)
    @ManyToOne
    @JsonIgnore
    private Visit VisitByVisitId;

    @JoinColumn(name = "clinician_id", insertable = false, updatable = false)
    @ManyToOne
    @JsonIgnore
    private User clinicianByUserId;

    @JoinColumn(name = "patient_id", insertable = false, updatable = false)
    @ManyToOne
    @JsonIgnore
    private Patient patientByPatientId;
}
