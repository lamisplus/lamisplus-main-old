package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class TestResultResponse {
    private String manifestID;
    private String receivingFacilityID;
    private String receivingFacilityName;
    private String sendingPCRLabID;
    private String sendingPCRLabName;
    private Integer testType;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private TestResult viralLoadTestReport;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private TestResult eidTestReport;

}
