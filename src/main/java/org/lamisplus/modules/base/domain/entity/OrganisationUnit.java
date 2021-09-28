package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "organisation_unit")
public class OrganisationUnit extends JsonBEntity implements Serializable {

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
    @Column(name = "organisation_unit_level_id")
    private Long organisationUnitLevelId;
    @Basic
    @Column(name = "parent_organisation_unit_id")
    private Long parentOrganisationUnitId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "details", nullable = false, columnDefinition = "jsonb")
    private Object details;

    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_created", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Column(name = "modified_by")
    @JsonIgnore
    @ToString.Exclude
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_modified")
    @JsonIgnore
    @ToString.Exclude
    private LocalDateTime dateModified = LocalDateTime.now();

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<Appointment> appointmentsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<ApplicationUserPatient> applicationUserPatientsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    public List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitsById;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<OrganisationUnitHierarchy> organisationUnitHierarchiesById;

    @OneToMany(mappedBy = "organisationUnitByParentOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<OrganisationUnitHierarchy> organisationUnitHierarchiesById_0;

    @OneToMany(mappedBy = "organisationUnitByOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<FormData> formDataById;

    @OneToMany(mappedBy = "organisationUnitByCurrentOrganisationUnitId")
    @JsonIgnore
    @ToString.Exclude
    public List<User> users;

    @Transient
    private String  parentOrganisationUnitName;

    @Transient
    private String  parentParentOrganisationUnitName;

}
