package org.lamisplus.modules.base.domain.mapper;



import org.lamisplus.modules.base.domain.dto.FlagDTO;
import org.lamisplus.modules.base.domain.entity.Drug;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FlagMapper {

    Flag toFlag(FlagDTO flagDTO);

    FlagDTO toFlagDTO(Flag flag);

    List<FlagDTO> toFlagDTOList(List<Flag> flags);
}
