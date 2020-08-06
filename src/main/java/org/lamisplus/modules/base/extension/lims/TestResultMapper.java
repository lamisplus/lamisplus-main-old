package org.lamisplus.modules.base.extension.lims;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface TestResultMapper {
    @Mappings({
            @Mapping(source="sampleManifest.manifestId", target="manifestID"),
            @Mapping(source = "sampleManifest.sendingFacilityId", target = "sendingFacilityID"),
            @Mapping(source = "sampleManifest.sendingFacilityName", target = "sendingFacilityName"),
            @Mapping(source = "sampleManifest.receivingLabId", target = "receivingPCRLabID"),
            @Mapping(source = "sampleManifest.receivingLabName", target = "receivingPCRLabName")
    })
    TestResultRequest toTestResultRequest(SampleManifest sampleManifest);
}
