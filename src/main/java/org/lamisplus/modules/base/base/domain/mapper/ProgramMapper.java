package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.ProgramDTO;
import org.lamisplus.modules.base.base.domain.entity.Program;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProgramMapper {
    ProgramDTO toProgram(Program program);
    Program toProgramDTO(ProgramDTO programDTO);
}
