package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.Flag;

import java.util.List;

@Data
public class FormFlagDTOS {

    private List<FormFlagDTO> formFlagDTOS;

    private Flag flag;
}
