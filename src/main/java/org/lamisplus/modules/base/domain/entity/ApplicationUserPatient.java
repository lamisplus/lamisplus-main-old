package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode
@NoArgsConstructor
@Table(name = "application_user_patient")
public class ApplicationUserPatient extends Audit<String>{

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
    @ToString.Exclude
    @JsonIgnore
    private User applicationUserByApplicationUserId;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ToString.Exclude
    @JsonIgnore
    private Patient patientByPatientId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id")
    @ToString.Exclude
    @JsonIgnore
    private OrganisationUnit organisationUnitByOrganisationUnitId;

    public ApplicationUserPatient(Long userId, Long patientId){
        this.userId = userId;
        this.patientId = patientId;
    }
}
