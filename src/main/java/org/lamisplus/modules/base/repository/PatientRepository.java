package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> , JpaSpecificationExecutor {
/*    @Query("select p from Person p where lower(p.firstName) like lower(concat('%', :search, '%')) " +
            "or lower(p.lastName) like lower(concat('%', :search, '%'))")
    List<Person> findByFirstNameLastName(String search);*/
    Optional<Patient> findByHospitalNumber(String number);
    //Optional<Patient> findByPersonId(Long PersonId);
    Optional<Patient> findById(Long patientId);
    Boolean existsByHospitalNumber(String patientNumber);
}
