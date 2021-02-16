package org.lamisplus.modules.base.domain.mapper;


import org.lamisplus.modules.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.domain.entity.Drug;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DrugMapper {

    Drug toDrug(DrugDTO drugDTO);

    DrugDTO toDrugDTO(Drug drug);

    List<DrugDTO> toDrugDTOList(List<Drug> drugs);

}
