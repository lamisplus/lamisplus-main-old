package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO;
import org.lamisplus.modules.base.domain.entity.Encounter;
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
public interface EncounterRepository extends JpaRepository<Encounter, Long> , JpaSpecificationExecutor {

    List <Encounter> findAllByPatientIdAndFormCodeAndOrganisationUnitId(Long patientId, String FormCode, Long organisationUnitId, Pageable pageable);

    Optional<Encounter> findOneByPatientIdAndFormCodeAndArchived(Long patientId, String FormCode, int Archived);

    Optional<Encounter> findByPatientIdAndProgramCodeAndFormCodeAndDateEncounterAndOrganisationUnitId(Long patientId, String ProgramCode, String FormCode, LocalDate dateFncounter, Long organisationUnitId);

/*    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO" +
            "(e.patientId, e.formCode, e.programCode, e.organisationUnitId, e.archived) FROM Encounter e WHERE e.patientId = ?1 and e.programCode = ?2 and e.organisationUnitId = ?3 and e.archived = ?4")*/

    @Query(value = "SELECT DISTINCT ON (patient_id, form_code) encounter.* FROM encounter " +
            "WHERE program_code = ?2 AND patient_id = ?1 " +
            "AND organisation_unit_id = ?3 AND archived = ?4 ORDER BY patient_id DESC", nativeQuery = true)
    List<Encounter> findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(Long patientId, String programCode, Long organisationUnitId, int archived);

/*    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO" +
            "(e.patientId, e.programCode, e.organisationUnitId, e.archived) FROM Encounter e WHERE e.programCode = ?1 and e.organisationUnitId = ?2 and e.archived = ?3")*/

    @Query(value = "SELECT DISTINCT ON (patient_id, program_code) encounter.* FROM encounter " +
            "WHERE program_code = ?1 " +
            "AND organisation_unit_id = ?2 AND archived = ?3 ORDER BY patient_id DESC", nativeQuery = true)
    List<Encounter> findDistinctProgramCodeAndOrganisationUnitIdAndArchived(String programCode, Long organisationUnitId, int archived);

    Long countByProgramCodeAndArchivedAndOrganisationUnitId(String programCode, int archived, Long organisationUnit);


    List<Encounter> findAllByOrganisationUnitIdAndArchived(Long organisationUnitId, int archived);

    Optional<Encounter> findByIdAndArchived(Long id, int archived);

    //escaping the columns for date
    @Query(value = "SELECT * FROM encounter e LEFT OUTER JOIN patient p ON p.id = e.patient_id " +
            "WHERE (p.details ->> 'firstName' ilike ?1 OR p.details ->> 'lastName' ilike ?2 " +
            "OR p.details ->> 'hospitalNumber' ilike ?3 OR details ->>'mobilePhoneNumber' ilike ?4) " +
            "AND e.form_code = ?5 " +
            "AND e.date_encounter >= ?6\\:\\:date AND e.date_encounter <= ?7\\:\\:date " +
            "AND p.organisation_unit_id = ?8 AND p.archived = ?9 AND e.archived = ?9 ORDER BY e.id DESC", nativeQuery = true)
    Page<Encounter> findEncounterPage(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber, String formCode,
                                      String dateStart, String dateEnd, Long organisationUnitId, int archived, Pageable pageable);

    List<Encounter> findByPatientByPatientIdAndDateModifiedIsAfter(Long patientId, LocalDate dateModified);


}

