package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "lab_test_group")
public class LabTestGroup extends Audit<String> {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @JsonIgnore
    @OneToMany(mappedBy = "labTestGroupByLabTestGroupId")
    @ToString.Exclude
    private List<LabTest> labTestsByLabTestGroup;
}
