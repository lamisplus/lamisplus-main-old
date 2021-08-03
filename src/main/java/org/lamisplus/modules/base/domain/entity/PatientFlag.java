package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringExclude;
import javax.persistence.*;

@Entity
@Getter
@Setter
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
    @JsonIgnore
    @ToStringExclude
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Patient patientByPatientId;

    @ManyToOne
    @JsonIgnore
    @ToStringExclude
    @JoinColumn(name = "flag_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Flag flag;

}