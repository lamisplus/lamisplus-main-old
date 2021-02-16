package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class RadiologyDTO {
    private Long id;
    private Long patientId;
    private String dateOrdered;
    private String typeTest;
    private String testArea;
    private String dateReported;
}
