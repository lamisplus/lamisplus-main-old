package org.lamisplus.modules.base.domain.dto;


import lombok.Data;

@Data
public class LabTestDTO {

    private Long id;

    private Long labTestGroupId;

    private String name;

    private String unitMeasurement;

}
