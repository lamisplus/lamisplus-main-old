package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "organisation_unit", schema = "public", catalog = "lamisplus-old-jwt")
public class OrganisationUnit implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "organisation_unit_level_id")
    private Long organisationUnitLevelId;

    @Basic
    @Column(name = "parent_organisation_unit_id")
    private Long parentOrganisationUnitId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    public Collection<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitsById;
}
