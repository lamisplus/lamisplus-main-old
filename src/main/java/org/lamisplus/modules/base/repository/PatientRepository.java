package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> , JpaSpecificationExecutor {

    Optional<Patient> findByHospitalNumberAndOrganisationUnitIdAndArchived(String number, Long OrganisationUnitId, int archived);

    Optional<Patient> findById(Long patientId);

    Optional<Patient> findByIdAndArchived(Long patientId, int archived);

    Boolean existsByHospitalNumber(String patientNumber);

    Long countByOrganisationUnitIdAndArchived(Long organisationUnitId, int archived);

    Optional<Patient> findByIdAndArchivedAndOrganisationUnitId(Long id, int archived, Long organisationUnitId);

    List<Patient> findAllByArchivedAndOrganisationUnitIdOrderByIdDesc(int archived, Long organisationUnitId);

    Page<Patient> findAllByOrganisationUnitIdAndArchivedOrderByIdDesc(Long organisationUnitId, int archived, Pageable pageable);

    List<Patient> findAllByIdIn(List<Long> patientId);

    @Query(value = "SELECT * FROM patient WHERE details ->>?1 like ?2 AND organisation_unit_id=?3 AND archived=?4", nativeQuery = true)
    Page<Patient> findAllByDetails(String key, String value, Long organisationUnitId, int archived, Pageable pageable);

    @Query(value = "SELECT * FROM patient WHERE details ->>?1 like ?2", nativeQuery = true)
    Page<Patient> findAllByDetails(String key, String value,Pageable pageable);

    @Query(value = "SELECT * FROM patient WHERE details ->>'firstName'like ?1 " +
            "OR details ->>'lastName' like ?2 OR details ->>'hospitalNumber' like ?3 AND organisation_unit_id=?4 AND archived=?5", nativeQuery = true)
    Page<Patient> findAllByDetails(String firstName, String lastName, String hospitalNumber, Long organisationUnitId, int archived, Pageable pageable);

    @Query(value = "SELECT * FROM patient WHERE (details ->>'firstName' ilike ?1 " +
            "OR details ->>'lastName' ilike ?2 OR details ->>'hospitalNumber' ilike ?3 " +
            "OR details ->>'mobilePhoneNumber' ilike ?4) AND organisation_unit_id=?5 AND archived=?6", nativeQuery = true)
    Page<Patient> findAllByFullDetails(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber, Long organisationUnitId, int archived, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE details -> 'gender' ->> 'display' ilike ?1 AND " +
            "organisation_unit_id=?2 AND archived=?3 AND details ->>'dateRegistration' BETWEEN ?4 AND ?5", nativeQuery = true)
    Long countByGender(String genderName, Long organisationUnitId, int archived, LocalDate later, LocalDate now);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "date_part('year', AGE(NOW(), (details ->>'dob')::timestamp))::int < ?3", nativeQuery = true)
    Long countByPediatrics(Long organisationUnitId, int archived, int age);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "details ->>'dob' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countByPediatrics(Long organisationUnitId, int archived, LocalDate later, LocalDate now);

    Optional<Patient> findByIdAndOrganisationUnitIdAndArchived(Long patientId, Long organisationUnitId, int archived);

   /* @Query(value = "SELECT * FROM (SELECT * FROM patient WHERE archived = ?2 AND organisation_unit_id = ?3 " +
            "AND id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?2)) p " +
            "LEFT JOIN (SELECT DISTINCT patient_id FROM encounter WHERE archived = ?2 " +
            "AND program_code = ?1 AND organisation_unit_id = ?3 " +
            "AND patient_id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?2)) e " +
            "ON p.id = e.patient_id ORDER BY p.id DESC", nativeQuery = true)
    Page<Patient> findAllByPatientNotCaseManaged(String programCode, int archived, Long organisationUnitId, Pageable pageable);
*/
    /*@Query(value = "SELECT * FROM (SELECT * FROM patient WHERE (details ->>'firstName' ilike ?1 " +
            "OR details ->>'lastName' ilike ?2 OR details ->>'hospitalNumber' ilike ?3 " +
            "OR details ->>'mobilePhoneNumber' ilike ?4 OR details ->'gender' ->> 'display' ilike ?5) AND " +
            "archived = ?6 AND organisation_unit_id = ?7 " +
            "AND id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?6)) p " +
            "LEFT JOIN (SELECT DISTINCT patient_id FROM encounter WHERE archived = ?6 " +
            "AND program_code = ?8 AND organisation_unit_id = ?7 " +
            "AND patient_id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?6)) e " +
            "ON p.id = e.patient_id ORDER BY p.id DESC", nativeQuery = true)*/

   @Query(value = "SELECT DISTINCT e.patient_id, p.* FROM encounter e " +
           "LEFT OUTER JOIN patient p ON p.id = e.patient_id " +
           "WHERE (p.details ->>'firstName' ilike ?1 OR p.details ->>'lastName' ilike ?2 " +
           "OR p.details ->>'hospitalNumber' ilike ?3 OR p.details ->>'mobilePhoneNumber' ilike ?4 " +
           "OR p.details ->'gender' ->> 'display' ilike ?5) AND " +
           "e.program_code = ?8 AND e.archived=?6 AND p.archived=?6 AND p.organisation_unit_id=?7 " +
           "AND e.organisation_unit_id=?7 " +
           "AND e.patient_id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?6)", nativeQuery = true)
   Page<Patient> findAllByPatientNotCaseManagedByFilteredParameters(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber,
                                                                     String gender, int archived, Long organisationUnitId, String programCode, Pageable pageable);


    @Query(value = "SELECT DISTINCT e.patient_id, p.* FROM encounter e " +
            "LEFT OUTER JOIN patient p ON p.id = e.patient_id " +
            "WHERE e.program_code = ?1 AND e.archived=?2 AND p.archived=?2 AND p.organisation_unit_id=?3 " +
            "AND e.organisation_unit_id=?3 " +
            "AND e.patient_id NOT IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?2)", nativeQuery = true)
    Page<Patient> findAllByPatientsNotManaged(String programCode, int archived, Long organisationUnitId, Pageable pageable);

    Optional<Patient> findByHospitalNumberAndPatientNumberTypeAndOrganisationUnitIdAndArchived(String hospitalNumber, String patientNumberType, Long organisationUnitId, int archived);

    @Query(value = "SELECT DISTINCT e.patient_id, p.* FROM encounter e " +
            "LEFT OUTER JOIN patient p ON p.id = e.patient_id " +
            "WHERE e.program_code = ?1 AND e.archived=?2 AND p.archived=?2 AND p.organisation_unit_id=?3 " +
            "AND e.organisation_unit_id=?3 " +
            "AND e.patient_id IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?2)", nativeQuery = true)
    Page<Patient> findAllByPatientsManaged(String programCode, int archived, Long organisationUnitId, Pageable pageable);

    @Query(value = "SELECT DISTINCT e.patient_id, p.* FROM encounter e " +
            "LEFT OUTER JOIN patient p ON p.id = e.patient_id " +
            "WHERE (p.details ->>'firstName' ilike ?1 OR p.details ->>'lastName' ilike ?2 " +
            "OR p.details ->>'hospitalNumber' ilike ?3 OR p.details ->>'mobilePhoneNumber' ilike ?4 " +
            "OR p.details ->'gender' ->> 'display' ilike ?5) AND " +
            "e.program_code = ?8 AND e.archived=?6 AND p.archived=?6 AND p.organisation_unit_id=?7 " +
            "AND e.organisation_unit_id=?7 " +
            "AND e.patient_id IN (SELECT DISTINCT patient_id FROM application_user_patient WHERE archived = ?6)", nativeQuery = true)
    Page<Patient> findAllByPatientManagedByFilteredParameters(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber,
                                                              String gender, int archived, Long organisationUnitId, String programCode, Pageable pageable);

    @Query(value = "SELECT p.identifier_number ->> 'identifier' " +
            "FROM patient, jsonb_array_elements(details ->'otherIdentifier') " +
            "WITH ordinality p(identifier_number) " +
            "WHERE patient.patient_number=?1 AND patient.patient_number_type = ?2 " +
            "AND p.identifier_number-> 'identifierType' ->> 'code' = ?3 " +
            "AND patient.archived = ?4 AND patient.organisation_unit_id = ?5", nativeQuery = true)
    Optional<String> findPatientIdentifierNumber(String hospitalNumber, String patientNumberType, String identifierCode, int archived, Long organisationUnitId);

    @Query(value = "SELECT p.identifier_number ->> 'identifier' " +
            "FROM patient, jsonb_array_elements(details ->'otherIdentifier') " +
            "WITH ordinality p(identifier_number) " +
            "WHERE patient.id=?1 " +
            "AND p.identifier_number-> 'identifierType' ->> 'code' = ?2 " +
            "AND patient.archived = ?3 AND patient.organisation_unit_id = ?4", nativeQuery = true)
    Optional<String> findPatientIdentifierNumberByPatientId(Long id, String identifierCode, int archived, Long organisationUnitId);
}