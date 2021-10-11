package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> , JpaSpecificationExecutor {
    Optional<Form> findByCode(String code);
    //List<Form> findByProgramCode(String programCode);
    Optional<Form> findByIdAndProgramCode(Long formId, String programCode);

    List<Form> findAllByUsageCodeAndArchived(Integer usageCode, Integer archived);
}

