package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.util.UuidGenerator;

import javax.persistence.*;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "Ward")
@DynamicUpdate
public class Ward extends Audit<String>{
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "uuid")
    private String uuid = UuidGenerator.getUuid();

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @Basic
    @Column(name = "organisation_unit_id")
    @JsonIgnore
    private Long organisationUnitId;
}
