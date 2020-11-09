package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class DHISDatasetDTO {
    private Long id;
    private String datasetName;
    private String datasetUid;
    private String dhisId;
}
