package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.domain.entity.FormFlag;

import java.util.List;


@Data
public class FormFlagDTO {

    private Long id;

    private Integer status;

    private String formCode;

    private Long flagId;
}