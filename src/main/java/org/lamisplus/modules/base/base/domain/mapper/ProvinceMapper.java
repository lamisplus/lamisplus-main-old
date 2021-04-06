package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.ProvinceDTO;
import org.lamisplus.modules.base.base.domain.entity.Province;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
    ProvinceDTO toProvince(Province province);
    Province toProvinceDTO(ProvinceDTO provinceDTODTO);
}
