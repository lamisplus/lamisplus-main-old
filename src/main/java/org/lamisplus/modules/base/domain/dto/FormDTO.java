package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

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

}
