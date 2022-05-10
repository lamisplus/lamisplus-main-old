package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd@HH:mm:ss")
    private Timestamp date;

    @NotNull(message = "patientId")
    private Long patientId;

    private Long visitId;

    private Object detail;

    private String hospitalNumber;
    private Object details;
    private String patientUuid;
    private String visitUuid;
    private String uuid;
    private String createdBy;
    private String modifiedBy;
    private LocalDateTime dateCreated;
    private LocalDateTime dateModified;
    private Long organisationUnitId;
    private Integer archived;

}
