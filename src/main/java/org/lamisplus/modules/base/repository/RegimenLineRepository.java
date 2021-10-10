package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.RegimenLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegimenLineRepository extends JpaRepository<RegimenLine, Long> {

    Optional<RegimenLine> findByIdAndArchived(Long id, int archived);

    List<RegimenLine> findAllByArchived(int archived);

    Optional<RegimenLine> getRegimenLineById(Long regimenLineId);

}
