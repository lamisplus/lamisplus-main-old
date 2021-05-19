package org.lamisplus.modules.base.repository;

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

    @Query(value = "SELECT COUNT(*) FROM form_data WHERE organisation_unit_id= ?1 AND " +
            "data ->>'lab_test_group' = ?2 AND data ->>'sample_order_date'  BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(Long organisationUnitId, String labTestName, LocalDate from, LocalDate to);
}