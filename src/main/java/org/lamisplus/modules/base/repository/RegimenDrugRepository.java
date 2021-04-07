package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.RegimenDrug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegimenDrugRepository extends JpaRepository<RegimenDrug, Long> {

    List<RegimenDrug> findAllByRegimenId(Long regimenId);
}
