package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class OrganisationUnitExtraction {
    private String organisationUnitName;
    private String parentOrganisationUnitName;
    private String parentParentOrganisationUnitName;
    private Long parentOrganisationUnitId;
    private String description;
}
