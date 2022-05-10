package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long>, JpaSpecificationExecutor {

    //List<Visit> findByPatientId(Long patient_Id);
    //Optional<Visit> findByPatientIdAndDateVisitStart(Long Patient_id, LocalDate DateVisitStart);
    //List<Visit> findByDateVisitStart(LocalDate DateVisitStart);
    //List<Visit> findByDateVisitStartOrderByVisitTypeIdDesc(LocalDate DateVisitStart);
    Optional<Visit> findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(Long Patient_id);

    //Optional<Visit> findTopByPatientIdAndDateVisitEndGreaterThanEqualOrderByDateVisitStartDesc(Long Patient_id, LocalDate Date);

    //List<Visit> findAllByVisitTypeIdAndArchived(Long visitTypeId, int archive);

    //Long countByVisitTypeIdAndArchived(Long visitTypeId, int archive);

    Optional<Visit> findByIdAndArchived(Long id, int archived);

    //Optional<Visit> findDistinctFirstByPatientIdAndDateVisitEnd(Long patientId, LocalDate dateVisitEnd);

    //Optional<Visit> findByPatientIdAndDateVisitStartAndDateVisitEnd(Long patientId, LocalDate dateVisitStart,LocalDate dateVisitEnd);

    Long countByVisitTypeIdAndArchivedAndOrganisationUnitId(long visitTypeId, int unarchived, Long organisationUnitId);

    Optional<Visit> findByIdAndArchivedAndOrganisationUnitId(Long id, int unarchived, Long organisationUnitId);

    Optional<Visit> findDistinctFirstByPatientIdAndDateVisitEndAndOrganisationUnitId(Long patientId,LocalDate dateVisitEnd, Long organisationUnitId);

    List<Visit> findAllByArchived(int unArchived);

    Optional<Visit> findOneByPatientIdAndDateVisitStart(Long patientId, LocalDate dateVisitStart);

    Optional<Visit> findTopByPatientIdAndDateVisitStartOrderByDateVisitStartDesc(Long patientId, LocalDate dateEncounter);

    @Query(value = "SELECT COUNT(*) FROM visit WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "date_visit_start BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(Long organisationUnitId, int archived, LocalDate to, LocalDate now);

    @Query(value = "SELECT COUNT(*) FROM visit WHERE organisation_unit_id= ?1 AND archived=?2 AND visit_type_id = ?3 AND " +
            "date_visit_start BETWEEN ?4 AND ?5", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(Long organisationUnitId, int archived, Long visitTypeId, LocalDate to, LocalDate now);

    @Query(value = "SELECT * FROM visit WHERE uuid is NULL", nativeQuery = true)
    List<Visit> findNullUuid();

    //Date Visit End Less than or equal to today

    Optional<Visit> findByUuid(String uuid);

    @Query(value = "select * from visit where date_modified >=:dateLastSync or date_created >=:dateLastSync", nativeQuery = true)
    List<Visit> getVisitsDueForServerUpload(@Param("dateLastSync") LocalDateTime dateLastSync);

}