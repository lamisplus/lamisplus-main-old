package org.lamisplus.modules.base.domain.mapper;



import org.lamisplus.modules.base.domain.dto.LabTestDTO;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StandardCodesetSourceMapper {
    StandardCodesetSourceDTO toStandardCodesetSourceDTO(StandardCodesetSource standardCodesetSource);
    StandardCodesetSource toStandardCodesetSource(StandardCodesetSourceDTO standardCodesetSourceDTO);
}
