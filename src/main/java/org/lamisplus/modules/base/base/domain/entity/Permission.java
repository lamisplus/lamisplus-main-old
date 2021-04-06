package org.lamisplus.modules.base.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "permission")
public class Permission implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "level", nullable = true, length = 255)
    private String permissionLevel;

    @Basic
    @Column(name = "menu_name")
    private String menuName;

    @Basic
    @Column(name = "description")
    private String description;
}
