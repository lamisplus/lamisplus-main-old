package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.DrugOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrugOrderRepository extends JpaRepository<DrugOrder, Long> {

    Optional<DrugOrder> findByIdAndArchived(Long id, int archived);

    List<DrugOrder> findAllByArchived(int archived);
}
