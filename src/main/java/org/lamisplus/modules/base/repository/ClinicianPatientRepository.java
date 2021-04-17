package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.ClinicianPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicianPatientRepository extends JpaRepository<ClinicianPatient, Long> , JpaSpecificationExecutor {
    Optional<ClinicianPatient> findByClinicianIdAndPatientIdAndVisitId(Long clinicianId, Long patientId, Long visitId);
    Optional<ClinicianPatient> findByVisitId(Long visitId);
}
