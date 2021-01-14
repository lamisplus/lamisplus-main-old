package org.lamisplus.modules.base.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "organisation_unit_hierarchy")
@AllArgsConstructor
@NoArgsConstructor
public class OrganisationUnitHierarchy {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "organisation_unit_id")
    private Long organisationUnitId;

    @Basic
    @Column(name = "parent_organisation_unit_id")
    private Long parentOrganisationUnitId;

    @Basic
    @Column(name = "organisation_unit_level_id")
    private Long organisationUnitLevelId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    private OrganisationUnit organisationUnitByOrganisationUnitId;

    @ManyToOne
    @JoinColumn(name = "parent_organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    private OrganisationUnit organisationUnitByParentOrganisationUnitId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_level_id", referencedColumnName = "id", insertable = false, updatable = false)
    private OrganisationUnitLevel organisationUnitLevelByOrganisationUnitLevelId;
}
