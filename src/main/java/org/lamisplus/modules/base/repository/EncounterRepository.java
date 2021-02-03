package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository

//EncounterRepository
public interface EncounterRepository extends JpaRepository<Encounter, Long> , JpaSpecificationExecutor {

    List <Encounter> findAllByPatientIdAndFormCodeAndOrganisationUnitId(Long patientId, String FormCode, Long organisationUnitId, Pageable pageable);

    //New
    Page<Encounter> findAllByPatientIdAndFormCodeAndArchived(Pageable pageable, Long patientId, String FormCode, int Archived);


    Optional<Encounter> findByPatientIdAndProgramCodeAndFormCodeAndDateEncounterAndOrganisationUnitId(Long patientId, String ProgramCode, String FormCode, LocalDate dateFncounter, Long organisationUnitId);

    List<Encounter> findByPatientId(Long PatientId);

    //TODO: in progress...
    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO" +
            "(e.patientId, e.formCode, e.programCode, e.organisationUnitId, e.archived) FROM Encounter e WHERE e.patientId = ?1 and e.programCode = ?2 and e.organisationUnitId = ?3 and e.archived = ?4")
    List<EncounterDistinctDTO> findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(Long patientId, String programCode, Long organisationUnitId, int archived);

    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.EncounterDistinctDTO" +
            "(e.patientId, e.programCode, e.organisationUnitId, e.archived) FROM Encounter e WHERE e.programCode = ?1 and e.organisationUnitId = ?2 and e.archived = ?3")
    List<EncounterDistinctDTO> findDistinctProgramCodeAndOrganisationUnitIdAndArchived(String programCode, Long organisationUnitId, int archived);

    //List<PatientObservation> findByPatientAndFormCodeTitle(Patient patient, Long formCode, String title);
    Optional<Encounter> findFirstByPatientIdAndProgramCodeAndFormCodeOrderByDateEncounterDesc(Long patientId, String ProgramCode, String FormCode);

    Long countByProgramCodeAndArchivedAndOrganisationUnitId(String programCode, int archived, Long organisationUnit);

    //Optional<Encounter> findByMaxDAndDateEncounter(String formCode, Long patientId);
    //List<Encounter> findAllByPatientIdAndProgramCodeAndFormCodeOrderByDateEncounterDesc(Long patientId, String ProgramCode, String FormCode);

    //List<Encounter> findAllByProgramCodeAndFormCodeAndDateEncounterOrderByDateEncounterDesc(String ProgramCode, String FormCode, LocalDate DateEncounter);

    //Optional <Encounter> findTopByProgramCodeAndFormCodeAndPatientIdOrderByDateEncounterAsc(String ProgramCode, String FormCode, Long patientId);

    //Optional <Encounter> findTopByProgramCodeAndFormCodeAndPatientIdOrderByDateEncounterDesc(String ProgramCode, String FormCode, Long patientId);

    //List<Encounter> findAllByPatientIdAndProgramCodeAndFormCodeAndDateEncounterBetween(Long patientId, String ProgramCode, String FormCode, LocalDate firstDate, LocalDate endDate);

   /* @Query("select e from Encounter e where e.programCode=?1 and e.formCode=?2 " +
            "and e.dateEncounter >= ?3 and e.dateEncounter <= ?4")
    List<Encounter> findAllByProgramCodeAndFormCodeAndDateEncounterIsBetweenQuery(String ProgramCode, String FormCode, LocalDate dateStart, LocalDate dateEnd);
*/
/*    @Query("select e from Encounter e where e.patientId=?1 and e.programCode=?2 and e.formCode=?3 " +
            "and e.dateEncounter >= ?4 and e.dateEncounter <= ?5 order by ?6, LIMIT = ?7")*/
   /* List <Encounter> findAllByPatientIdAndProgramCodeAndFormCode(Long patientId, String ProgramCode, String FormCode, Pageable pageable);

    Optional<Encounter> findFirstByPatientIdAndProgramCodeAndFormCodeAndVisitIdOrderByDateEncounterDesc(Long patientId, String ProgramCode, String FormCode, Long visitId);

    List<Encounter> findAllByPatientIdAndFormCode(Long patientId, String formCode);
*/
    /*@Query("select DISTINCT e from Encounter e where e.patientId=?1")
    List<Encounter> findAllByPatientId(Long patientId);
*/

    //Encounter
    //Optional<Encounter> findByPatientIdAndProgramCodeAndFormCodeAndVisitId(Long patientId, String ProgramCode, String FormCode, Long visitId);


    //List<Encounter> findAllByFormCode(String formCode);\

    List<Encounter> findAllByOrganisationUnitIdAndArchived(Long organisationUnitId, int archived);

    Optional<Encounter> findByIdAndArchived(Long id, int archived);
}

