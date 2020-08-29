package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class IcdDTO {
    private Long id;
    private Long standardId;
    private String categoryCode;
    private String diagnosisCode;
    private String fullCode;
    private String abbreviatedDescription;
    private String fullDescription;
    private String categoryTitle;
}
