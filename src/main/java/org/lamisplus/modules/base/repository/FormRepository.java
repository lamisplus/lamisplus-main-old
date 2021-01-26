package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> , JpaSpecificationExecutor {
    Optional<Form> findByCodeAndArchived(String code, int archived);

    Optional<Form> findByIdAndArchived(Long id, int archived);

    Optional<Form> findByIdAndProgramCode(Long formId, String programCode);

    List<Form> findAllByUsageCodeAndArchived(Integer usageCode, Integer archived);

    Optional<Form> findByNameAndProgramCodeAndArchived(String name, String programCode, int archived);

    List<Form> findAllByArchivedOrderByIdAsc(int archived);
}

