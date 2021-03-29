package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "drug_group")
public class DrugGroup extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "uuid", updatable = false)
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @OneToMany(mappedBy = "drugGroupByDrugGroupId")
    @JsonIgnore
    @ToString.Exclude
    private List<Drug> drugsById;
}
