package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor {
    List<Appointment> findAllByPatientIdAndArchivedAndVisitId(Long patientId, int archived, Long visitId);

    Optional<Appointment> findByIdAndArchived(Long id, int archived);

    List<Appointment> findAllByArchivedAndOrganisationUnitIdOrderByIdAsc(int archived, Long organisationUnit);

    @Query(value = "SELECT COUNT(*) FROM appointment WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "detail ->>'appointment_date' BETWEEN ?3 AND ?4", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndArchivedAndDateBetween(Long organisationUnitId, int archive, LocalDate from, LocalDate to);

    @Query(value = "SELECT COUNT(*) FROM appointment WHERE organisation_unit_id= ?1 AND archived=?2 AND " +
            "detail ->>'appointment_date'=?3", nativeQuery = true)
    Long countAllByOrganisationUnitIdAndArchivedAndDate(Long organisationUnitId, int archive, LocalDate now);

    Optional<Appointment> findByUuid(String uuid);

    @Query(value = "SELECT * FROM appointment WHERE uuid is NULL", nativeQuery = true)
    List<Appointment> findNullUuid();

    @Query(value = "select * from appointment where date_modified >=:dateLastSync or date_created >=:dateLastSync", nativeQuery = true)
    List<Appointment> getAppointmentsDueForServerUpload(@Param("dateLastSync") LocalDateTime dateLastSync);
}