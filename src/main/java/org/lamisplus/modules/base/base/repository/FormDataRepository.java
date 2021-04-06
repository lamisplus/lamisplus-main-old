package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FormDataRepository extends JpaRepository<FormData, Long>, JpaSpecificationExecutor {
}
