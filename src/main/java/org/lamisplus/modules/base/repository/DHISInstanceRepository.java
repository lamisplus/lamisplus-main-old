package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.DHISInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DHISInstanceRepository extends JpaRepository<DHISInstance, Long>, JpaSpecificationExecutor {
    Boolean existsDHISInstanceById(Long dhisId);

}
