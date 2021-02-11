package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "organisation_unit")
public class OrganisationUnit implements Serializable {

    @Id
    @Column(name = "id")
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
    public List<Appointment> appointmentsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    public List<ApplicationUserPatient> applicationUserPatientsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    public List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    public List<OrganisationUnitHierarchy> organisationUnitHierarchiesById;

    @OneToMany(mappedBy = "organisationUnitByParentOrganisationUnitId")
    @JsonIgnore
    public List<OrganisationUnitHierarchy> organisationUnitHierarchiesById_0;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    public List<FormData> formDataById;

    @OneToMany(mappedBy = "organisationUnitByCurrentOrganisationUnitId")
    @JsonIgnore
    public List<User> users;
}
