package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.DrugDispense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrugDispenseRepository extends JpaRepository<DrugDispense, Long> {

    Optional<DrugDispense> findByIdAndArchived(Long id, int archived);

    List<DrugDispense> findAllByArchived(int archived);
}
