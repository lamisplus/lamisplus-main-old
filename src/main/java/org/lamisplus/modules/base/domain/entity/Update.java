package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "update")
public class Update {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "version")
    private Double version;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "url")
    private String url;

    @Basic
    @Column(name = "date_created")
    private String dateCreated;

    @Basic
    @Column(name = "created_by")
    private String createdBy;

    @Basic
    @Column(name = "status")
    private Integer status;

    @Basic
    @Column(name = "size")
    private String size;
 }
