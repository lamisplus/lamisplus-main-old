package org.lamisplus.modules.base.base.domain.entity;

import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.base.util.converter.LocalDateConverter;
import org.lamisplus.modules.base.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@EqualsAndHashCode
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
    @JsonIgnore
    private Integer archived = 0;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Patient patientByPatientId;

    @ManyToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Visit visitByVisitId;

    @ManyToOne
    @JoinColumn(name = "form_code", referencedColumnName = "code", insertable = false, updatable = false)
    @JsonIgnore
    private Form formForEncounterByFormCode;

    @ManyToOne
    @JoinColumn(name = "program_code", referencedColumnName = "uuid", insertable = false, updatable = false)
    @JsonIgnore
    private Program programForEncounterByProgramCode;

    @OneToMany(mappedBy = "encounterByEncounterId")
    @JsonIgnore
    private List<FormData> formDataByEncounter;
    }
