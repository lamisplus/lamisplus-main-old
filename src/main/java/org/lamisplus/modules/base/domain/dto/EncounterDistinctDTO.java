package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class EncounterDistinctDTO {
    private String formCode;
    private Long patientId;
    private String programCode;
    private Long organisationUnitId;
    private int archived;



    public EncounterDistinctDTO(Long patientId, String formCode, String programCode, Long organisationUnitId, int archived) {
        this.patientId = patientId;
        this.formCode = formCode;
        this.programCode = programCode;
        this.organisationUnitId = organisationUnitId;
        this.archived = archived;
    }

    public EncounterDistinctDTO(Long patientId, String programCode, Long organisationUnitId, int archived) {
        this(patientId, null, programCode, organisationUnitId, archived);
    }
}
