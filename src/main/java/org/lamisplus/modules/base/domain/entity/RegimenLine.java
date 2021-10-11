package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "regimen_line")
public class RegimenLine implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @OneToMany(mappedBy = "regimenLineByRegimenLineId")
    @JsonIgnore
    private List<Regimen> regimensByRegimenLine;

}
