package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class EncounterDistinctDTO {
    private String formCode;
    private Long patientId;
    private String programCode;
    private Long organisationUnitId;



    public EncounterDistinctDTO(Long patientId, String formCode, String programCode, Long organisationUnitId) {
        this.patientId = patientId;
        this.formCode = formCode;
        this.programCode = programCode;
        this.organisationUnitId = organisationUnitId;
    }
}
