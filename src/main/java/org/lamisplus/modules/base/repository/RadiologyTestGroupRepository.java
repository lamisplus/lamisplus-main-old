package org.lamisplus.modules.base.repository;
import org.lamisplus.modules.base.domain.entity.RadiologyTestGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RadiologyTestGroupRepository extends JpaRepository<RadiologyTestGroup, Long>, JpaSpecificationExecutor {
}
