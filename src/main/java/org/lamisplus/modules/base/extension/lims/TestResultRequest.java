package org.lamisplus.modules.base.extension.lims;

import lombok.Data;

@Data
public class TestResultRequest {
    private String manifestID;
    private String sendingFacilityID;
    private String sendingFacilityName;
    private String receivingPCRLabID;
    private String receivingPCRLabName;
    private Integer testType;
}
