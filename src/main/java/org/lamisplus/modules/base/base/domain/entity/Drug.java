package org.lamisplus.modules.base.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "drug")
public class Drug implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "brand_name")
    private String brandName;

    @Basic
    @Column(name = "generic_name")
    private String genericName;

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
    @Column(name = "code")
    private String name;

    @Basic
    @Column(name = "drug_group_id")
    public Long drugGroupId;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;

    @ManyToOne
    @JoinColumn(name = "drug_group_id", referencedColumnName = "id", updatable = false, insertable = false)
    @JsonIgnore
    public DrugGroup drugGroupByDrugGroupId;

}
