package org.lamisplus.modules.base.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "program")
public class Program implements Serializable {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "code", updatable = false)
    private String code;

    @Basic
    @Column(name = "module_id")
    private Long moduleId;

    @Basic
    @Column(name = "archived")
    @NotNull(message = "Archived is null")
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
    @ToString.Exclude
    public Module moduleByModuleId;
}
