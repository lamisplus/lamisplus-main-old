package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "regimen_drug")
public class RegimenDrug extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Basic
    @Column(name = "regimen_id")
    private Long regimenId;

    @Basic
    @Column(name = "drug_id")
    private Long drugId;

    @ManyToOne
    @JoinColumn(name = "regimen_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Regimen regimenByRegimenId;

    @ManyToOne
    @JoinColumn(name = "drug_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Drug drugByDrugId;
}
