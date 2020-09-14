package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "global_variable")
public class GlobalVariable implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "format")
    private String format;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;
}
