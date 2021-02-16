package org.lamisplus.modules.base.domain.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "data_source")
public class DataSource implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", unique = true)
    private String name;

    @Basic
    @Column(name = "format")
    private String format;

    @Basic
    @Column(name = "description")
    private String description;

}
