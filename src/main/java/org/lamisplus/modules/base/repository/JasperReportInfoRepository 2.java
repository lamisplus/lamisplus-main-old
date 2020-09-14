package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface JasperReportInfoRepository extends JpaRepository<JasperReportInfo, Long>, JpaSpecificationExecutor {
    Optional<JasperReportInfo> findByName(String name);
}
