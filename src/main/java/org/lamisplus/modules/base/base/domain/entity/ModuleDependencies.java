package org.lamisplus.modules.base.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "module_dependencies")
public class ModuleDependencies implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "version")
    private String version;

    @Basic
    @Column(name = "dependency_id")
    private Long dependencyId;

    @Basic
    @Column(name = "module_id")
    private Long moduleId;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Module moduleByDependencyId;
}
