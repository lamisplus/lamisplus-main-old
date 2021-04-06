package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.base.domain.entity.StandardCodesetSource;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StandardCodesetSourceMapper {
    StandardCodesetSourceDTO toStandardCodesetSourceDTO(StandardCodesetSource standardCodesetSource);
    StandardCodesetSource toStandardCodesetSource(StandardCodesetSourceDTO standardCodesetSourceDTO);
    List<StandardCodesetSourceDTO> toStandardCodesetSourceDTOList(List<StandardCodesetSource> standardCodesetSource);

}
