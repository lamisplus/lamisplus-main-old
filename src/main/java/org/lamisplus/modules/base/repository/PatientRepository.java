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
            "OR details ->>'lastName' ilike ?2 OR details ->>'hospitalNumber' ilike ?3) AND organisation_unit_id=?4 AND archived=?5", nativeQuery = true)
    Page<Patient> findAllByFullDetails(String firstName, String lastName, String hospitalNumber, Long organisationUnitId, int archived, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE details -> 'gender' ->> 'display' ilike ?1 AND " +
            "organisation_unit_id=?2 AND archived=?3 AND details ->>'dateRegistration' BETWEEN ?4 AND ?5", nativeQuery = true)
    Long countByGender(String genderName, Long organisationUnitId, int archived, LocalDate later, LocalDate now);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "date_part('year', AGE(NOW(), (details ->>'dob')::timestamp))::int < ?3", nativeQuery = true)
    Long countByPediatrics(Long organisationUnitId, int archived, int age);

    @Query(value = "SELECT COUNT(*) FROM patient WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "details ->>'dob' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countByPediatrics(Long organisationUnitId, int archived, LocalDate later, LocalDate now);

}