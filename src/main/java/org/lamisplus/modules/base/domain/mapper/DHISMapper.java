package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.DHISDatasetDTO;
import org.lamisplus.modules.base.domain.dto.DHISDatavalueDTO;
import org.lamisplus.modules.base.domain.dto.DHISInstanceDTO;
import org.lamisplus.modules.base.domain.dto.DHISDataelementDTO;
import org.lamisplus.modules.base.domain.entity.DHISDataset;
import org.lamisplus.modules.base.domain.entity.DHISDatavalue;
import org.lamisplus.modules.base.domain.entity.DHISInstance;
import org.lamisplus.modules.base.domain.entity.DHISDataelement;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DHISMapper {
    DHISInstance toDHISInstance(DHISInstanceDTO dhisInstanceDTO);
    DHISInstanceDTO toDHISInstanceDTO(DHISInstance dhisInstance);
    DHISDataset toDHISDataset(DHISDatasetDTO datasetDTO);
    DHISDatasetDTO toDatasetDTO(DHISDataset datasets);
    DHISDataelement toDataelement(DHISDataelementDTO dhisDataelementDTO);
    DHISDataelementDTO toDataelementDTO(DHISDataelement dhisDataelement);
    DHISDatavalue toDatavalue(DHISDatavalueDTO datavalueDTO);
    DHISDatavalueDTO toDatavalueDTO(DHISDatavalue datavalue);


}
