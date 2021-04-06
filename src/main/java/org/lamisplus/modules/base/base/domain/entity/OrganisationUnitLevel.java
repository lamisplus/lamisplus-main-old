package org.lamisplus.modules.base.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "organisation_unit_level")
public class OrganisationUnitLevel implements Serializable {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @Basic
    @Column(name = "status")
    private int status;

    @OneToMany(mappedBy = "organisationUnitLevelByOrganisationUnitLevelId")
    @ToString.Exclude
    @JsonIgnore
    public List<OrganisationUnitHierarchy> organisationUnitHierarchiesById;
}
