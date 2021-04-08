package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Biometric;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BiometricRepository  extends JpaRepository<Biometric, Long> {
    List<Biometric> findBiometricByPatient(Patient patient);
}
