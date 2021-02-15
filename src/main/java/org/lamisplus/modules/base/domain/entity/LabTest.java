package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;


@Data
@Entity
@EqualsAndHashCode
@Table(name = "lab_test")
public class LabTest extends Audit<String> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "lab_test_group_id")
    private Long labTestGroupId;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "unit_measurement")
    private String unitMeasurement;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @ManyToOne
    @JoinColumn(name = "lab_test_group_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private LabTestGroup labTestGroupByLabTestGroupId;

}
