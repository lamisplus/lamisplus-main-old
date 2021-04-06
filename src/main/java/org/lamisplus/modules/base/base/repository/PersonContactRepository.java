package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.PersonContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonContactRepository extends JpaRepository<PersonContact, Long> {

    Optional<PersonContact> findByPersonId(Long personId);
    /*PersonContact findByPersonByPersonId(Person person);
    PersonContact findAllByPersonId(Long id);*/
}
