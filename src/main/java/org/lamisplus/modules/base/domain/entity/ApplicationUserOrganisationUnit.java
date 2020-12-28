package org.lamisplus.modules.base.domain.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "application_user_organisation_unit")
public class ApplicationUserOrganisationUnit {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "application_user_id")
    public Long applicationUserId;
    @Basic
    @Column(name = "organisation_unit_id")
    public Long organisationUnitId;

    @ManyToOne
    @JoinColumn(name = "application_user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public User applicationUserByApplicationUserId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public OrganisationUnit organisationUnitByOrganisationUnitId;
}
