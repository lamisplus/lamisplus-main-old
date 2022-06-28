package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "drug_dispense")
@EqualsAndHashCode
@Data
public class DrugDispense {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "drug_order_id", referencedColumnName = "id", updatable = false, insertable = false)
    private DrugOrder drugOrderByDrugOrderId;
}
