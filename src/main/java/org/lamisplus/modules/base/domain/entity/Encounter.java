package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.util.converter.LocalDateConverter;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@EqualsAndHashCode
@ToString
@Table(name = "encounter")
@Data
public class Encounter implements Serializable  {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    @Basic
    @Column(name = "visit_id", nullable = false)
    private Long visitId;

    @Basic
    @Column(name = "form_code", nullable = false)
    private String formCode;
    @Basic
    @Column(name = "program_code", nullable = false)
    private String programCode;

    @Basic
    @Column(name = "date_encounter")
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateEncounter;

    @Basic
    @Column(name = "date_created", nullable = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeCreated;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    /*@Basic
    @Column(name = "date_created")
    @JsonIgnore
    private Timestamp dateCreated;*/

    @CreatedBy
    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "organisation_unit_id")
    private Long organisationUnitId;

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private Timestamp dateModified;

    @LastModifiedBy
    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Patient patientByPatientId;

    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Visit visitByVisitId;

    @ManyToOne
    @JoinColumn(name = "form_code", referencedColumnName = "code", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Form formForEncounterByFormCode;

    @ManyToOne
    @JoinColumn(name = "program_code", referencedColumnName = "code", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Program programForEncounterByProgramCode;

    @OneToMany(mappedBy = "encounterByEncounterId")
    @JsonIgnore
    @ToString.Exclude
    private List<FormData> formDataByEncounter;
    }
