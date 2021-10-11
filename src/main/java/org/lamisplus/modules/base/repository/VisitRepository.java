package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Visit;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long>, JpaSpecificationExecutor {

    List<Visit> findByPatientId(Long patient_Id);
    Optional<Visit> findByPatientIdAndDateVisitStart(Long Patient_id, LocalDate DateVisitStart);
    List<Visit> findByDateVisitStart(LocalDate DateVisitStart);
    List<Visit> findByDateVisitStartOrderByVisitTypeIdDesc(LocalDate DateVisitStart);
    Optional<Visit> findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(Long Patient_id);

    Optional<Visit> findTopByPatientIdAndDateVisitEndGreaterThanEqualOrderByDateVisitStartDesc(Long Patient_id, LocalDate Date);

    //Date Visit End Less than or equal to today
}
