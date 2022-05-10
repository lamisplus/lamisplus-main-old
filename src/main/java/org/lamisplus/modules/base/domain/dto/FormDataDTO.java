package org.lamisplus.modules.base.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormDataDTO {

    private Long id;

    private Object data;

    private Long encounterId;

    private String uuid;
    private String encounterUuid;
    private Long organisationUnitId;

}
