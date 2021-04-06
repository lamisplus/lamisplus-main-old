package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.base.base.domain.entity.Form;

import javax.persistence.Transient;

@Data
@NoArgsConstructor
public class FormDTO {
    
    private Long id;

    private String name;

    private String code;

    private Integer usageCode;

    private Object resourceObject;

    private String resourcePath;

    private Object formPrecedence;

    private String programCode;

    private String version;

    @Transient
    private String programName;
}
