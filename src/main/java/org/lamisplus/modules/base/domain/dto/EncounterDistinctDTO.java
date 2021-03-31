package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class EncounterDistinctDTO {
    private String formCode;
    private Long patientId;
    private String programCode;


    public EncounterDistinctDTO(Long patientId, String formCode, String programCode) {
        this.patientId = patientId;
        this.formCode = formCode;
        this.programCode = programCode;

    }
}
