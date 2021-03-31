package org.lamisplus.modules.base.extension.lims;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface TestResultRequestMapper {
    @Mappings({
            @Mapping(source="sampleManifest.manifestId", target="manifestID"),
            @Mapping(source = "sampleManifest.sendingFacilityId", target = "facilityID"),
            @Mapping(source = "sampleManifest.receivingLabId", target = "sendingPCRLabID")
    })
    TestResultRequest toTestResultRequest(SampleManifest sampleManifest);

    @Mappings({
            @Mapping(source = "viralLoadTestReport.sampleID", target = "id"),
            @Mapping(source = "viralLoadTestReport.dateSampleRecievedAtPCRLab", target = "dateSampleReceivedLab"),
            @Mapping(source = "viralLoadTestReport.assayDate", target = "dateAssayed"),
            @Mapping(source = "viralLoadTestReport.approvalDate", target = "dateApproved"),
            @Mapping(source = "viralLoadTestReport.resultDate", target = "dateResultReported")
    })
    SampleManifest toSampleManifest(ViralLoadTestReport viralLoadTestReport);
}
