package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Regimen;
import org.lamisplus.modules.base.domain.entity.RegimenLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegimenRepository extends JpaRepository<Regimen, Long> {

    List<Regimen> findAllByRegimenLineIdAndArchived(Long regimenLineId, int archived);

    Optional<Regimen> findByIdAndArchived(Long id, int archived);
}
