package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "drug")
public class Drug extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "drug_group_id")
    private Long drugGroupId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private int archived;

    @ManyToOne
    @JoinColumn(name = "drug_group_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private DrugGroup drugGroupByDrugGroupId;

    /*@OneToMany(mappedBy = "drugByDrugId")
    @JsonIgnore
    @ToString.Exclude
    private List<DrugInventory> drugInventoriesById;*/

    @OneToMany(mappedBy = "drugByDrugId")
    @JsonIgnore
    @ToString.Exclude
    private List<RegimenDrug> regimenDrugsById;
}
