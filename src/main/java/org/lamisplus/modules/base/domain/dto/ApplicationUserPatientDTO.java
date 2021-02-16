package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.User;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Data
public class ApplicationUserPatientDTO {
    private Long id;
    private Long UserId;
    private List<Long> patientIds;
}
