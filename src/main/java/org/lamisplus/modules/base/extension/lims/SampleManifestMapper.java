package org.lamisplus.modules.base.extension.lims;

import org.lamisplus.modules.base.domain.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface SampleManifestMapper {
    @Mappings({
            @Mapping(source="person.firstName", target="firstName"),
            @Mapping(source="person.lastName", target="surName"),
            @Mapping(source="person.dob", target="dateOfBirth"),
            @Mapping(source="sampleManifest.id", target="sampleID"),
            @Mapping(source="sampleManifest.sampleOrderedBy", target="sampleOrderedBy"),
            @Mapping(source="sampleManifest.dateSampleOrdered", target="sampleOrderDate"),
            @Mapping(source="sampleManifest.sampleCollectedBy", target="sampleCollectedBy"),
            @Mapping(source="sampleManifest.dateSampleCollected", target="sampleCollectionDate"),
            @Mapping(source="sampleManifest.dateSampleDispatched", target="dateSampleSent")
    })
    ViralLoadSampleInformation toViralLoadSampleInformation(SampleManifest sampleManifest, Person person);

    @Mappings({
            @Mapping(source="person.firstName", target="firstName"),
            @Mapping(source="person.lastName", target="surName"),
            @Mapping(source="person.dob", target="dateOfBirth"),
            @Mapping(source="sampleManifest.id", target="sampleID"),
            @Mapping(source="sampleManifest.sampleOrderedBy", target="sampleOrderedBy"),
            @Mapping(source="sampleManifest.dateSampleOrdered", target="sampleOrderDate"),
            @Mapping(source="sampleManifest.sampleCollectedBy", target="sampleCollectedBy"),
            @Mapping(source="sampleManifest.dateSampleCollected", target="sampleCollectionDate"),
            @Mapping(source="sampleManifest.dateSampleDispatched", target="dateSampleSent")
    })
    EidSampleInformation toEidSampleInformation(SampleManifest sampleManifest, Person person);

    @Mappings({
            @Mapping(source="sampleManifest.manifestId", target="manifestID"),
            @Mapping(source = "sampleManifest.sendingFacilityId", target = "sendingFacilityID"),
            @Mapping(source = "sampleManifest.receivingLabId", target = "receivingLabID")
    })
    ViralLoadManifest toViralLoadManifest(SampleManifest sampleManifest);

    @Mappings({
            @Mapping(source="sampleManifest.manifestId", target="manifestID"),
            @Mapping(source = "sampleManifest.sendingFacilityId", target = "sendingFacilityID"),
            @Mapping(source = "sampleManifest.receivingLabId", target = "receivingLabID")
    })
    EidManifest toEidManifest(SampleManifest sampleManifest);

    SampleManifest toSampleManifest(SampleManifestDTO sampleManifestDTO);

}
