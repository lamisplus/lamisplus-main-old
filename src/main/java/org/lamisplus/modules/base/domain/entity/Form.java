package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "form")
public class Form extends JsonBEntity implements Serializable {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "code")
    @NotNull
    private String code;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "resource_object", nullable = false, columnDefinition = "jsonb")
    private Object resourceObject;

    @Basic
    @Column(name = "resource_path")
    private String resourcePath;

    @Basic
    @Column(name = "main_code")
    private String mainCode;

    @Basic
    @Column(name = "program_code")
    private String programCode;

    @Basic
    @Column(name = "type")
    private Integer type;

    @Basic
    @Column(name = "version")
    private String version;

    @Basic
    @Column(name = "usage_status")
    private Integer usageCode=0;

    @Basic
    @Column(name = "name")
    private String name;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "form_precedence", columnDefinition = "jsonb")
    private Object formPrecedence;

    @Basic
    @Column(name = "date_created", updatable = false)
    @JsonIgnore
    @CreationTimestamp
    private LocalDateTime dateCreated = LocalDateTime.now();

    @CreatedBy
    @Basic
    @Column(name = "created_by", updatable = false)
    @JsonIgnore
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private LocalDateTime dateModified = LocalDateTime.now();

    @LastModifiedBy
    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @ManyToOne
    @JoinColumn(name = "program_code", referencedColumnName = "code", insertable = false, updatable = false)
    @ToString.Exclude
    @JsonIgnore
    private Program programByProgramCode;

    @OneToMany(mappedBy = "formForEncounterByFormCode")
    @ToString.Exclude
    @JsonIgnore
    private List<Encounter> encountersByForm;

    @Transient
    private String programName;



    public Form(Long id, String name, String code, Integer usageCode, String resourcePath, Object formPrecedence, String programCode, String version){
        this.id = id;
        this.name = name;
        this.code = code;
        this.usageCode = usageCode;
        this.resourcePath = resourcePath;
        this.formPrecedence = formPrecedence;
        this.programCode = programCode;
        this.version = version;
    }
}