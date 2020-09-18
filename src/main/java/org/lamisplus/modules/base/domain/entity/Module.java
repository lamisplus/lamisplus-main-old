package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "module")
public class Module implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "active", nullable = false)
    private Boolean active;

    @Basic
    @Column(name = "artifact_id")
    private String artifact_id;

    @Basic
    @Column(name = "base_package")
    private String basePackage;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "version")
    private String version;

    @Basic
    @Column(name = "uuid")
    @JsonIgnore
    private String uuid;

    @Basic
    @Column(name = "date_created")
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "date_installed")
    @UpdateTimestamp
    private Timestamp dateInstalled;

    @Basic
    @Column(name = "installed_by")
    @JsonIgnore
    private String installedBy;

    @Basic
    @Column(name = "status")
    private Integer status;

    @Basic
    @Column(name = "archived")
    private Integer archived = 0;

    @Basic
    @Column(name = "module_type")
    private Integer moduleType = 0;

    @OneToMany(mappedBy = "moduleByDependencyId")
    @JsonIgnore
    @ToString.Exclude
    public List<ModuleDependencies> moduleDependenciesByModule;

    @OneToMany(mappedBy = "moduleByModuleId")
    @JsonIgnore
    @ToString.Exclude
    private List<Program> programsByModule;
}
