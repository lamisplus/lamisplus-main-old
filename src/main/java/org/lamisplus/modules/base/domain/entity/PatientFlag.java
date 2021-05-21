package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "patient_flag")
@IdClass(PatientFlagPK.class)
public class PatientFlag {
    @Id
    @Column(name = "patient_id")
    private Long patientId;

    @Id
    @Column(name = "flag_id")
    private Long flagId;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Patient patientByPatientId;

    @ManyToOne
    @JoinColumn(name = "flag_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Flag Flag;
}