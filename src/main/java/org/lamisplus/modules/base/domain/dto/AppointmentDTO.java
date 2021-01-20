package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.sql.Timestamp;

@Data
public class AppointmentDTO {

    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd@HH:mm:ss")
    private Timestamp date;

    private Long patientId;

    private Long visitId;

    private Object detail;
}
