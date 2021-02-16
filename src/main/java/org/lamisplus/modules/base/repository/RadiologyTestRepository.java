package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.RadiologyTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RadiologyTestRepository extends JpaRepository<RadiologyTest, Long>, JpaSpecificationExecutor {
    List<RadiologyTest> findRadiologyTestsByGroupId(Long groupId);
}
