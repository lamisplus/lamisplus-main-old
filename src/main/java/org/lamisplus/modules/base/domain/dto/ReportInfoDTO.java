package org.lamisplus.modules.base.domain.dto;

import lombok.Data;


@Data
public class ReportInfoDTO {

    private Long id;

    private String name;

    private String description;

    private String format;

    private String programCode;

    private String template;

    private String programName;


}
