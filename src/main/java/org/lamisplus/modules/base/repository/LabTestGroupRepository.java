package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.LabTestGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabTestGroupRepository extends JpaRepository<LabTestGroup, Long> {
    Optional<LabTestGroup> findByIdAndArchived(Long id, int archived);
}
