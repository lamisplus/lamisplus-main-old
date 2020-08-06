package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "drug_group")
public class DrugGroup implements Serializable {
    @Id
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
    @Column(name = "date_created")
    @CreationTimestamp
    @JsonIgnore
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @UpdateTimestamp
    @JsonIgnore
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;

    @OneToMany(mappedBy = "drugGroupByDrugGroupId")
    @JsonIgnore
    @ToString.Exclude
    private List<Drug> drugsByDrugGroup;

}
