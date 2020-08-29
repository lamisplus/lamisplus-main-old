package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Encounter;
import org.springframework.data.domain.Pageable;
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

    List <Encounter> findAllByPatientIdAndFormCode(Long patientId, String FormCode, Pageable pageable);

    Optional<Encounter> findByPatientIdAndProgramCodeAndFormCodeAndDateEncounter(Long patientId, String ProgramCode, String FormCode, LocalDate dateFncounter);

    List<Encounter> findByPatientId(Long PatientId);

    //List<PatientObservation> findByPatientAndFormCodeTitle(Patient patient, Long formCode, String title);
    Optional<Encounter> findFirstByPatientIdAndProgramCodeAndFormCodeOrderByDateEncounterDesc(Long patientId, String ProgramCode, String FormCode);

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


    //List<Encounter> findAllByFormCode(String formCode);
}

