package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "regimen")
public class Regimen extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "regimen_line_id")
    private Long regimenLineId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;

    @ManyToOne
    @JoinColumn(name = "regimen_line_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private RegimenLine regimenLineByRegimenLineId;

    @OneToMany(mappedBy = "regimenByRegimenId")
    @JsonIgnore
    @ToString.Exclude
    private List<RegimenDrug> regimenDrugsById;
}
