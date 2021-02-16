package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "program")
public class Program implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "module_id")
    private Long moduleId;

    @Basic
    @Column(name = "archived")
    private Integer archived;

    @OneToMany(mappedBy = "programForEncounterByProgramCode")
    @ToString.Exclude
    @JsonIgnore
    private List<Encounter> encountersByProgram;

    @OneToMany(mappedBy = "programByProgramCode")
    @JsonIgnore
    @ToString.Exclude
    private List<Form> formsByProgram;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    public Module moduleByModuleId;
}