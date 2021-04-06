package org.lamisplus.modules.base.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.base.util.UuidGenerator;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "Ward")
public class Ward {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "date_created")
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @UpdateTimestamp
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    private String modifiedBy;

    @Basic
    @Column(name = "uuid")
    private String uuid = UuidGenerator.getUuid();

    @Basic
    @Column(name = "archived")
    private Integer archived = 0;
}
