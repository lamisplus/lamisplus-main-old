package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FormDataRepository extends JpaRepository<FormData, Long>, JpaSpecificationExecutor {
    Optional<FormData> findByIdAndOrganisationUnitId(Long id, Long organisationUnitId);

    List<FormData> findAllByOrganisationUnitId(Long organisationUnitId);

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'lab_test_group' = ?2 AND data ->>'sample_order_date'  BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndLabTestNameAndDateBetween(Long organisationUnitId, String labTestName, LocalDate from, LocalDate to);


    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'lab_test_group' NOT IN (?2) AND data ->>'sample_order_date'  BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndNotInLabTestNamesAndDateBetween(Long organisationUnitId, List<String> labTestName, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'lab_test_order_status' IS NOT NULL AND data ->>'sample_order_date'  BETWEEN ?2 AND ?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndLabTestAndDateBetween(Long organisationUnitId, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'lab_test_order_status' ilike ?2 AND data ->>'sample_order_date' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(Long organisationUnitId, String status, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'prescription_status' IS NOT NULL AND data ->>'date_prescribed' BETWEEN ?2 AND ?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(Long organisationUnitId, LocalDate from, LocalDate now);

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'prescription_status' IS NOT NULL AND data ->>'date_dispensed' BETWEEN ?2 AND ?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(Long organisationUnitId, LocalDate from, LocalDate now);

    @Query(value = "SELECT COUNT(*) FROM form_data f LEFT JOIN encounter e ON e.id=f.id " +
            "WHERE f.organisation_unit_id= ?1 AND e.form_code='bdf039fb-06e8-4aec-bb28-20c09eb3651d' " +
            "AND f.data ->>'test_order_status' ilike ?2 AND e.archived=0 AND " +
            "f.data ->>'order_date' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(Long organisationUnitId, String labTestName, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data f LEFT JOIN encounter e ON e.id=f.id " +
            "WHERE f.organisation_unit_id= ?1 AND e.form_code='bdf039fb-06e8-4aec-bb28-20c09eb3651d' " +
            "AND f.data ->>'test_order_status' NOT IN (?2) AND e.archived=0 AND " +
            "f.data ->>'order_date' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndRadiologyTestNameNotInAndDateBetween(Long organisationUnitId, List<String> labTestName, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data f LEFT JOIN encounter e ON e.id=f.id " +
            "WHERE f.organisation_unit_id= ?1 AND e.form_code='bdf039fb-06e8-4aec-bb28-20c09eb3651d' " +
            "AND f.data ->>'test_order_status' IS NOT NULL AND e.archived=0 AND " +
            "f.data ->>'order_date' BETWEEN ?2 AND ?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(Long organisationUnitId, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM form_data f LEFT JOIN encounter e ON e.id=f.id " +
            "WHERE f.organisation_unit_id= ?1 AND e.form_code='bdf039fb-06e8-4aec-bb28-20c09eb3651d' " +
            "AND f.data ->>'test_order_status' ilike ?2 AND e.archived=0 AND " +
            "f.data ->>'order_date' BETWEEN ?2 AND ?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(Long organisationUnitId, String status, LocalDate from, LocalDate to);

    List<FormData> findByEncounterId(Long encounterId);

    Optional<FormData> findOneByEncounterIdOrderByIdDesc(Long encounterId);


    @Query(value = "select d from FormData d where d.encounterId in (select e.id from Encounter e where e.formCode = ?1 and e.patientId = ?2)")
    List<FormData> findByFormCodeAndPatientId(String formCode, Long patientId);

    @Query(value = "select d from FormData d where d.encounterId = (select distinct e.id from Encounter e where e.dateEncounter = ?1 and e.patientId = ?2)")
    List<FormData> findByDateEncounterAndPatientId(LocalDate dateEncounter, Long patientId);

    void deleteAllByEncounterId(Long encounterId);

    @Query(value = "SELECT * FROM form_data WHERE uuid is NULL", nativeQuery = true)
    List<FormData> findNullUuid();

    Optional<FormData> findByUuid(String uuid);

    @Query(value = "select * from form_data where date_modified >=:dateLastSync or date_created >=:dateLastSync", nativeQuery = true)
    List<FormData> getFormDataDueForServerUpload(@Param("dateLastSync") LocalDateTime dateLastSync);
}