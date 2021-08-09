package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.PatientFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientFlagRepository extends JpaRepository<PatientFlag, Long> {

    Optional<PatientFlag> findByPatientIdAndFlagId(Long patientId, Long flagId);

    List<PatientFlag> findAllByPatientId(Long patientId);
}