package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FormDataRepository extends JpaRepository<FormData, Long>, JpaSpecificationExecutor {
    Optional<FormData> findByIdAndOrganisationUnitId(Long id, Long organisationUnitId);

    List<FormData> findAllByOrganisationUnitId(Long organisationUnitId);
}
