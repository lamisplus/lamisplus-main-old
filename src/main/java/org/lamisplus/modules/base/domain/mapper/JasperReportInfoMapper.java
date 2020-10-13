package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JasperReportInfoMapper {
    JasperReportInfoDTO toJasperReportInfoDTO(JasperReportInfo jasperReportInfo);
    JasperReportInfo toJasperReportInfo(JasperReportInfoDTO jasperReportInfoDTO);
}
