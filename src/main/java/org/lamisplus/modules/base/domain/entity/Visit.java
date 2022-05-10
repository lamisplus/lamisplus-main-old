package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "visit")
@NoArgsConstructor
@AllArgsConstructor
public class Visit extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "date_visit_end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateVisitEnd;

    @Basic
    @Column(name = "date_visit_start")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateVisitStart;

    @Basic
    @Column(name = "time_visit_start")
    @Convert(converter = LocalTimeAttributeConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    @NotNull(message = "timeVisitStart cannot be null")
    private LocalTime timeVisitStart;

    @Basic
    @Column(name = "time_visit_end", nullable = true)
    @Convert(converter = LocalTimeAttributeConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    private LocalTime timeVisitEnd;

    @Basic
    @Column(name = "date_next_appointment")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateNextAppointment;

    @Basic
    @Column(name = "patient_id", updatable = false)
    private Long patientId;

    @Basic
    @Column(name = "visit_type_id")
    private Long visitTypeId;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @Basic
    @Column(name = "type_patient")
    private Integer typePatient = 0;

    @JoinColumn(name = "patient_id", insertable = false, updatable = false)
    @ManyToOne
    @JsonIgnore
    @ToString.Exclude
    private Patient patientByVisit;

    @OneToMany(mappedBy = "visitByVisitId")
    @ToString.Exclude
    @JsonIgnore
    private List<Encounter> encountersByVisit;

    @Basic
    @Column(name = "organisation_unit_id", updatable = false)
    private Long organisationUnitId;

    @OneToMany(mappedBy = "visitByVisitId")
    @JsonIgnore
    @ToString.Exclude
    public List<Appointment> appointmentsById;
}
