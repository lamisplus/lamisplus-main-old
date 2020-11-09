package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class DHISInstanceDTO {
    private Long id;
    private String siteUrl;
    private String site;
    private String orgunit;
    private String orgunitUid;
}
