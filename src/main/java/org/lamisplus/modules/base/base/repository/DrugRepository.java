package org.lamisplus.modules.base.base.repository;


import org.lamisplus.modules.base.base.domain.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Long> {
    Optional<Drug> findByBrandName(String brandName);
}
