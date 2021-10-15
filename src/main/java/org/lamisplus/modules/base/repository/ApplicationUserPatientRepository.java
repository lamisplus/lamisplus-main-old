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

    Optional<ApplicationUserPatient> findAllByPatientIdAndArchived(Long patientId, int archived);

    Optional<ApplicationUserPatient> findByIdAndArchived(Long id, int archived);

    Optional<ApplicationUserPatient> findAllByPatientIdAndUserIdAndArchived(Long patientId, Long userId, int archived);

    List<ApplicationUserPatient> findAllByUserIdAndArchived(Long id, int archived);

    @Query (value = "SELECT count(*) FROM application_user_patient " +
            "WHERE application_user_id = ?1 AND program_code = ?2 " +
            "AND archived = ?3", nativeQuery = true)
    int findCountOfPatientManagedByUserInASpecificProgram(Long userId, String programCode, int archived);

    @Query (value = "SELECT count(*) FROM application_user_patient " +
            "WHERE application_user_id = ?1 " +
            "AND archived = ?2", nativeQuery = true)
    int findCountOfPatientManagedByUserInAllProgram(Long userId, int archived);

    Optional<ApplicationUserPatient> findAllByPatientIdAndUserIdAndProgramCodeAndArchived(Long patientId, Long userId, String programCode, int archived);
}
