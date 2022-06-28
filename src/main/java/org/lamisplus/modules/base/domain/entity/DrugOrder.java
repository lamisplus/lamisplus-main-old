package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "drug_order")
@Data
@EqualsAndHashCode
public class DrugOrder {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd@HH:mm:ss")
    private LocalDateTime dateTimePrescribed;

    private String brand;
    private Integer dosageFrequency;
    private String type;
    private Integer archived;


    @CreatedBy
    @Basic
    @Column(name = "created_by", updatable = false)
    @JsonIgnore
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @UpdateTimestamp
    private LocalDateTime dateCreated = LocalDateTime.now();

    @LastModifiedBy
    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private LocalDateTime dateModified = LocalDateTime.now();

    @JsonIgnore
    private Long organisationUnitId;

    @OneToMany(mappedBy = "drugOrderByDrugOrderId")
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<DrugDispense> drugDispensesById;
}
