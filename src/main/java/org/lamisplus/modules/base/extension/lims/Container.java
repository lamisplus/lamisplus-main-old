package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class Container {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ViralLoadManifestDTO viralLoadManifest;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EidManifestDTO eidManifest;
}
