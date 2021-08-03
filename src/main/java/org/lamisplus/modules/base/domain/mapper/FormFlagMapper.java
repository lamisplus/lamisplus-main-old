package org.lamisplus.modules.base.domain.mapper;



import org.lamisplus.modules.base.domain.dto.FormFlagDTO;
import org.lamisplus.modules.base.domain.dto.FormFlagDTOS;
import org.lamisplus.modules.base.domain.entity.FormFlag;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FormFlagMapper {

    FormFlag toFormFlag(FormFlagDTO formFlagDTO);

    FormFlagDTO toFormFlagDTO(FormFlag formFlag);

    List<FormFlagDTO> toFormFlagDTOs(List<FormFlag> formFlags);

    FormFlag toFormFlagDTOS(FormFlagDTOS formFlagDTOS);

}
