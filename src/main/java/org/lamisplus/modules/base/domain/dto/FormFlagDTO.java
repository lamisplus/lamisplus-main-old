package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.domain.entity.FormFlag;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.util.List;


@Data
public class FormFlagDTO {

    private Long id;

    private Integer status;

    @NotNull(message = "formCode cannot be null")
    private String formCode;

    private Long flagId;
}