package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.lamisplus.modules.base.domain.entity.DrugDispense;
import org.lamisplus.modules.base.domain.entity.DrugOrder;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DrugOrderDTO {
    private Long id;

    private String prescriptionGroupId;
    private String uuid;
    private String drugName;
    private String dosageStrength;
    private String dosageUnit;
    private String comments;
    private String orderedBy;
    private String duration;
    private Long patientId;
    private Date startDate;
    private String durationUnit;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-ddTHH:mm:ss")
    private LocalDateTime dateTimePrescribed;

    private String brand;
    private Integer dosageFrequency;
    private String type;
    private Integer archived;
}
