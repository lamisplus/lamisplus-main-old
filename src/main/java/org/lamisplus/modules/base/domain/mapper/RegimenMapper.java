package org.lamisplus.modules.base.domain.mapper;


import org.lamisplus.modules.base.domain.dto.RegimenDTO;
import org.lamisplus.modules.base.domain.entity.Regimen;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RegimenMapper {

    Regimen toRegimen(RegimenDTO regimenDTO);

    RegimenDTO toRegimenDTO(Regimen regimen);

    List<RegimenDTO> toRegimenDTOList(List<Regimen> regimens);

}
