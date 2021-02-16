package org.lamisplus.modules.base.extension.lims;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SampleManifestDTOs implements Serializable  {
    private List<SampleManifestDTO> sampleManifests;
}
