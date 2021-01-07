package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "application_user_id", insertable = true, updatable = true)
    public Long applicationUserId;
    @Basic
    @Column(name = "organisation_unit_id", insertable = true, updatable = true)
    public Long organisationUnitId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "application_user_id", referencedColumnName = "id", insertable = false, updatable = false)
    public User applicationUserByApplicationUserId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    public OrganisationUnit organisationUnitByOrganisationUnitId;
}
