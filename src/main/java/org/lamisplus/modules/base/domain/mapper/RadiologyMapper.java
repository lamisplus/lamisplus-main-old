package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.RadiologyDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RadiologyMapper {
    RadiologyDTO toRadiologyDTO(Radiology radiology);
    Radiology toRadiology(RadiologyDTO radiologyDTO);
}
