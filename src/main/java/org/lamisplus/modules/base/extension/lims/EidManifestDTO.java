package org.lamisplus.modules.base.extension.lims;

import lombok.Data;

import java.util.List;

@Data
public class EidManifestDTO {
    private String manifestID;
    private String sendingFacilityID;
    private String sendingFacilityName;
    private String receivingLabID;
    private String receivingLabName;
    private List<EidSampleInformationDTO> sampleInformation;
}
