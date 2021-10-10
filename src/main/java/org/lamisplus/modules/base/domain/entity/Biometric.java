package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Biometric extends Audit<String> {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Basic(optional = false)
    @Column(name = "id")
    private String id;

    @JoinColumn(name = "patient_id", referencedColumnName = "uuid")
    @ManyToOne(optional = false)
    private Patient patient;

    @ManyToOne(optional = false)
    private OrganisationUnit organisationUnit;

    @NotNull
    private byte[] template;

    private String biometricType;

    private String templateType;

    private LocalDate dateEnrollment;

    private LocalDateTime dateLastModified;

    private Boolean iso;

    private boolean archived = false;

    @PrePersist
    @PreUpdate
    public void update() {
        this.dateLastModified = LocalDateTime.now();
    }
}