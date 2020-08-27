package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "application_codeset")
public class ApplicationCodeset implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "codeset_group", nullable = true)
    private String codesetGroup;

    @Basic
    @Column(name = "version", nullable = true)
    private String version;

    @Basic
    @Column(name = "language", nullable = true)
    private String language;

    @Basic
    @Column(name = "display", nullable = true)
    private String display;

    @Basic
    @Column(name = "active", nullable = true)
    private Integer active;

    @Basic
    @Column(name = "code", nullable = true)
    private String code;

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @UpdateTimestamp
    @JsonIgnore
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived", nullable = true)
    @JsonIgnore
    private Integer archived = 0;

}
