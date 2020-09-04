package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.IcdDTO;
import org.lamisplus.modules.base.domain.entity.Icd;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IcdMapper {
    IcdDTO toIcdDTO(Icd icd);
    Icd toIcd(IcdDTO icdDTO);
}
