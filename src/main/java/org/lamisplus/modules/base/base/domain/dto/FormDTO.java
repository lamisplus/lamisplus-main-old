package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;

import javax.persistence.Transient;

@Data
public class FormDTO {

    private Long id;

    private String name;

    private String code;

    private Integer usageCode;

    private Object resourceObject;

    private String resourcePath;

    private String programCode;

    private String version;

    @Transient
    private String programName;

}
