package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "application_codeset")
public class ApplicationCodeSet extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "codeset_group")
    private String codesetGroup;

    @Basic
    @Column(name = "language")
    private String language;

    @Basic
    @Column(name = "display")
    private String display;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;
}
