package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganisationUnitRepository extends JpaRepository<OrganisationUnit, Long> {
    List<OrganisationUnit> findOrganisationUnitByParentOrganisationUnitId(Long id);
}
