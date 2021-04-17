package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class ClinicianPatientDTO {

    @JsonIgnore
    private Long id;

    private Long visitId;

    private Long patientId;

    private Long clinicianId;

    private Long applicationCodesetId;
}
