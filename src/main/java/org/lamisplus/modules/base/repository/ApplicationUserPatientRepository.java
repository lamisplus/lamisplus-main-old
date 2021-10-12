package org.lamisplus.modules.base.repository;


import com.gs.collections.api.BooleanIterable;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationUserPatientRepository extends JpaRepository<ApplicationUserPatient, Long>, JpaSpecificationExecutor {

    List<ApplicationUserPatient> findAllByUserId(Long userId);
    Optional<ApplicationUserPatient> findAllByPatientIdAndArchived(Long patientId, int archived);
    List<ApplicationUserPatient> findAllByPatientIdIn(List<Long> patientIds);

    List<ApplicationUserPatient> findAllByArchivedAndPatientIdNotIn(int archived, List<Long> patientIds);

    Optional<ApplicationUserPatient> findByIdAndArchived(Long id, int archived);

    Optional<ApplicationUserPatient> findAllByPatientIdAndUserIdAndArchived(Long patientId, Long userId, int archived);

    List<ApplicationUserPatient> findAllByUserIdAndArchived(Long id, int archived);
}
