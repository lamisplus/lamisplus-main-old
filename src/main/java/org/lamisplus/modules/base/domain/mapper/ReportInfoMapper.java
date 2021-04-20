package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.ReportInfo;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReportInfoMapper {
    ReportInfoDTO toReportInfoDTO(ReportInfo reportInfo);
    ReportInfo toReportInfo(ReportInfoDTO reportInfoDTO);


    @Named("mapWithoutTemplate")
    @Mapping(target = "resourceObject", ignore = true)
    ReportInfoDTO mapWithoutTemplate(ReportInfo reportInfo);

    @IterableMapping(qualifiedByName="mapWithoutTemplate")
    List<ReportInfoDTO> toReportInfoDTOs(List<ReportInfo> reportInfos);
}
