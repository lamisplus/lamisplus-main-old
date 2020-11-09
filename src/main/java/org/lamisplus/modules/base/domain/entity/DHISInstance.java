package org.lamisplus.modules.base.domain.entity;


import lombok.*;
import javax.persistence.*;

import javax.validation.constraints.NotNull;
import java.io.Serializable;



@Data
@Entity
@EqualsAndHashCode
@Table(name = "dhis_instances")
public class DHISInstance implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "site_url")
    @NotNull
    private String siteUrl;

    @Basic
    @Column(name = "site")
    private String site;

    @Basic
    @Column(name = "orgunit")
    private String orgunit;

    @Basic
    @Column(name = "orgunit_uid")
    private String orgunitUid;

}