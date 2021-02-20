package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.FormDataDTO;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrganisationUnitMapper {
    OrganisationUnit toOrganisationUnit(OrganisationUnitDTO organisationUnitDTO);

    OrganisationUnitDTO toOrganisationUnitDTO(OrganisationUnit organisationUnit);

}
