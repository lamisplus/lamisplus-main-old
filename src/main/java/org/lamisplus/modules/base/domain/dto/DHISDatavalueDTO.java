package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class DHISDatavalueDTO {
    private Long id;
    private String period;
    private String orgunitUid;
    private String datasetUid;
    private String dataelementUid;
    private String categoryOptionComboUid;
    private String attributeOptionComboUid;
    private String datavalue;
}
