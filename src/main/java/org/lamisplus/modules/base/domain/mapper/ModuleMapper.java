package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ModuleMapper {

    ModuleDTO toModule(Module module);
    Module toModuleDTO(ModuleDTO moduleDTO);
}
