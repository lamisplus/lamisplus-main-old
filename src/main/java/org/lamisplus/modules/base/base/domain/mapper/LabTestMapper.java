package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.LabTestDTO;
import org.lamisplus.modules.base.base.domain.entity.LabTest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LabTestMapper {
    LabTestDTO toLabTest(LabTest labTest);
}
