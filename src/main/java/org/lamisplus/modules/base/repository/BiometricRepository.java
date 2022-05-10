package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Biometric;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiometricRepository extends JpaRepository<Biometric, Long> {
    List<Biometric> findBiometricByPatient(Patient patient);

    Optional<Biometric> findById(String uuid);

    @Query(value = "SELECT * FROM biometric WHERE id is NULL", nativeQuery = true)
    List<Biometric> findNullUuid();
}
