package org.lamisplus.modules.base.base.domain.mapper;

import org.lamisplus.modules.base.base.domain.dto.ReportInfoDTO;
import org.lamisplus.modules.base.base.domain.entity.ReportInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReportInfoMapper {
    ReportInfoDTO toReportInfoDTO(ReportInfo reportInfo);
    ReportInfo toReportInfo(ReportInfoDTO reportInfoDTO);
}
