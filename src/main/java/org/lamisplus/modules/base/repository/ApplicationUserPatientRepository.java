package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationUserPatientRepository extends JpaRepository<ApplicationUserPatient, Long>, JpaSpecificationExecutor {

    List<ApplicationUserPatient> findAllByUserId(Long userId);
    Optional<ApplicationUserPatient> findAllByPatientId(Long patientId);

}
