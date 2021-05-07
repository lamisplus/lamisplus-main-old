package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

@Data
@EqualsAndHashCode
public class PatientFlagPK implements Serializable {
    @Column(name = "patient_id")
    @Id
    private Long patientId;

    @Column(name = "flag_id")
    @Id
    private Long flagId;
}
