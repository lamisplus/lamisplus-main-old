package org.lamisplus.modules.base.base.domain.mapper;


import org.lamisplus.modules.base.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.base.domain.entity.ApplicationCodeSet;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationCodesetMapper {

    ApplicationCodeSet toApplicationCodeset(ApplicationCodesetDTO applicationCodesetDTO);

    ApplicationCodesetDTO toApplicationCodesetDTO(ApplicationCodeSet applicationCodeset);

    List<ApplicationCodesetDTO> toApplicationCodesetDTOList(List<ApplicationCodeSet> applicationCodesets);
}
