package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> , JpaSpecificationExecutor {
/*    @Query("select p from Person p where lower(p.firstName) like lower(concat('%', :search, '%')) " +
            "or lower(p.lastName) like lower(concat('%', :search, '%'))")
    List<Person> findByFirstNameLastName(String search);*/
    Optional<Patient> findByHospitalNumberAndOrganisationUnitIdAndArchived(String number, Long OrganisationUnitId, int archived);
    //Optional<Patient> findByPersonId(Long PersonId);
    Optional<Patient> findById(Long patientId);


    Boolean existsByHospitalNumber(String patientNumber);

    Long countByOrganisationUnitIdAndArchived(Long organisationUnitId, int archived);

    Optional<Patient> findByIdAndArchivedAndOrganisationUnitId(Long id, int archived, Long organisationUnitId);
}
