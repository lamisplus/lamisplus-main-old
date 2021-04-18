package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

    @Query(value = "SELECT * FROM patient WHERE details ->>'firstName'like ?1 " +
            "AND details ->>'lastName' like ?2 AND details ->>'hospitalNumber' like ?3 AND organisation_unit_id=?4 AND archived=?5", nativeQuery = true)
    Page<Patient> findAllByFullDetails(String firstName, String lastName, String hospitalNumber, Long organisationUnitId, int archived, Pageable pageable);

}
