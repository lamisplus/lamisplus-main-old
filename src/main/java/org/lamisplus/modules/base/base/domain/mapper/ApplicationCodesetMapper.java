package org.lamisplus.modules.base.base.domain.mapper;


import org.lamisplus.modules.base.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.base.domain.entity.ApplicationCodeset;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApplicationCodesetMapper {

    ApplicationCodeset toApplicationCodeset(ApplicationCodesetDTO applicationCodesetDTO);

    ApplicationCodesetDTO toApplicationCodesetDTO(ApplicationCodeset applicationCodeset);


}
