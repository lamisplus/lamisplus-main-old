package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.RadiologyTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface RadiologyTestRepository extends JpaRepository<RadiologyTest, Long>, JpaSpecificationExecutor {

    List<RadiologyTest> findAllByGroupIdAndArchived(Long groupId, int archived);

    Optional<RadiologyTest> findByIdAndArchived(Long id, int archived);

    List<RadiologyTest> findAllByArchived(int archived);
}
