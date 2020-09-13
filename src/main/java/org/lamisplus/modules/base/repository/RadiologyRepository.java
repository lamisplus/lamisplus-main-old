package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Radiology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RadiologyRepository extends JpaRepository<Radiology, Long>, JpaSpecificationExecutor {
}
