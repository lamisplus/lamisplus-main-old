package org.lamisplus.modules.base.extension.lims;

import lombok.Data;
import java.util.List;

@Data
public class TestResultResponse {
    public String manifestID;
    public String receivingFacilityID;
    public String receivingFacilityName;
    public String sendingPCRLabID;
    public String sendingPCRLabName;
    public String testType;
    public List<ViralLoadTestReport> viralLoadTestReport;
}
