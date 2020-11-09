package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class DHISDataelementDTO {
    private Long id;
    private String dataset;
    private String datasetUid;
    private String dataelement;
    private String dataelementUid;
    private String categoryOptionCombo;
    private String categoryOptionComboUid;
    private String attributeOptionCombo;
    private String attributeOptionComboUid;
    private String dataQuery;
}