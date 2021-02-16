package org.lamisplus.modules.base.domain.mapper;



import org.lamisplus.modules.base.domain.dto.PersonRelativesDTO;
import org.lamisplus.modules.base.domain.entity.PersonRelative;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonRelativeMapper {
    PersonRelative toPersonRelative(PersonRelativesDTO personRelativeDTO);

    PersonRelativesDTO toPersonRelativeDTO(PersonRelative personRelative);

    List<PersonRelativesDTO> toPersonRelativeDTOList(List<PersonRelative> personRelatives);

}
