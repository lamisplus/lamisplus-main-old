package org.lamisplus.modules.base.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode

@Table(name = "application_user_patient")
public class ApplicationUserPatient {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "application_user_id")
    private Long userId;

    @Basic
    @Column(name = "patient_id")
    private Long patientId;

    @ManyToOne
    @JoinColumn(name = "application_user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User applicationUserByApplicationUserId;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Patient patientByPatientId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id")
    public OrganisationUnit organisationUnitByOrganisationUnitId;

    public ApplicationUserPatient(Long userId, Long patientId){
        this.userId = userId;
        this.patientId = patientId;
    }
}
