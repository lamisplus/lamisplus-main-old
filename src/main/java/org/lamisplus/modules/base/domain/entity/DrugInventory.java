package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "drug_inventory")
public class DrugInventory extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "drug_id")
    private Long drugId;

    @Basic
    @Column(name = "brand_name")
    private String brandName;

    @Basic
    @Column(name = "strength")
    private String strength;

    @Basic
    @Column(name = "pack_size")
    private Integer packSize;

    @Basic
    @Column(name = "dosage_form")
    private String dosageForm;

    @Basic
    @Column(name = "uuid")
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;

    /*@ManyToOne
    @JoinColumn(name = "drug_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Drug drugByDrugId;*/
}
