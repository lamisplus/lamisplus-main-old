package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.GlobalVariableDTO;
import org.lamisplus.modules.base.domain.entity.GlobalVariable;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GlobalVariableMapper {
    GlobalVariable toGlobalVariable(GlobalVariableDTO globalVariableDTO);
    GlobalVariableDTO toGlobalVariableDTO(GlobalVariable globalVariable);
}
