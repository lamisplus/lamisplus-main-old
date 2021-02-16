package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.ReportInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ReportInfoRepository extends JpaRepository<ReportInfo, Long>, JpaSpecificationExecutor {
    Optional<ReportInfo> findByName(String name);
    List<ReportInfo> findAllByArchived(int archived);

    Optional<ReportInfo> findByNameAndArchived(String name, int archived);

    Optional<ReportInfo> findByIdAndArchived(Long id, int archived);
}
