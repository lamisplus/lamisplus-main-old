package org.lamisplus.modules.base.domain.mapper;



import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.StandardCodeset;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StandardCodesetMapper {
    StandardCodesetDTO toStandardCodesetDTO(StandardCodeset standardCodeset);
    StandardCodeset toStandardCodeset(StandardCodesetDTO standardCodesetDTO);

}
