package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ApplicationUserPatientDTO {
    private Long id;
    @NotNull(message = "UserId cannot be empty")
    private Long UserId;
    @NotNull(message = "programCode cannot be empty")
    private String programCode;
    @NotNull(message = "patientIds cannot be empty")
    private List<Long> patientIds;
    private Integer archived;
}
