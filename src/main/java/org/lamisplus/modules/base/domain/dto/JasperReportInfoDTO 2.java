package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class JasperReportInfoDTO {
    private Long id;

    private String name;

    private String description;

    private String datasource;

    private String programCode;

    private String template;

    private Object parameterResourceObject;

}
