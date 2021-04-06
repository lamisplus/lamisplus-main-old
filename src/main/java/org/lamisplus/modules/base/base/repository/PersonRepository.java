package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findById(Long personId);
    //List<Person> findAllByOrderByIdDesc();
}
