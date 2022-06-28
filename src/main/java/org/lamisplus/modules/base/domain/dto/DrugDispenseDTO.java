package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.lamisplus.modules.base.domain.entity.DrugOrder;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

@Data
public class DrugDispenseDTO {
    private Long id;
    private String drugName;
    private String uuid;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-ddTHH:mm:ss")
    private LocalDateTime dateTimeDispensed;
    private String comment;
    private String brand;
    private Long quantity;
    private String unit;
    private String dispensedBy;
    private Date startDate;
    private String dosageStrength;
    private String dosageStrengthUnit;
    private Integer dosageFrequency;
    private Long drug_id;
    private Integer archived;
}
