package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "flag")
public class Flag {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "priority")
    private Long priority;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "visible")
    private Boolean visible;

    @Basic
    @Column(name = "module_id")
    private String module_id;

/*
    @ManyToOne
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "module_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Module moduleByModuleId;
*/

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "Flag")
    private List<PatientFlag> patientFlagsById;
}