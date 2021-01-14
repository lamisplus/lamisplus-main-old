package org.lamisplus.modules.base.domain.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "application_user_patient")
public class ApplicationUserPatient {
    private Long id;
    private User applicationUserByApplicationUserId;
    private Patient patientByPatientId;

    @Id
    @Column(name = "id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplicationUserPatient that = (ApplicationUserPatient) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @ManyToOne
    @JoinColumn(name = "application_user_id", referencedColumnName = "id", nullable = false)
    public User getApplicationUserByApplicationUserId() {
        return applicationUserByApplicationUserId;
    }

    public void setApplicationUserByApplicationUserId(User applicationUserByApplicationUserId) {
        this.applicationUserByApplicationUserId = applicationUserByApplicationUserId;
    }

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = false)
    public Patient getPatientByPatientId() {
        return patientByPatientId;
    }

    public void setPatientByPatientId(Patient patientByPatientId) {
        this.patientByPatientId = patientByPatientId;
    }
}
