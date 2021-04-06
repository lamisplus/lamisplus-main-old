package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.base.domain.entity.StandardCodeset;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StandardCodesetMapper {
    StandardCodesetDTO toStandardCodesetDTO(StandardCodeset standardCodeset);
    StandardCodeset toStandardCodeset(StandardCodesetDTO standardCodesetDTO);
    List<StandardCodesetDTO> toStandardCodesetDTOList(List<StandardCodeset> standardCodesets);


}
