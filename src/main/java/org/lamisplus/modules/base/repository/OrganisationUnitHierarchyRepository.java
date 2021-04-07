package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.OrganisationUnitHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganisationUnitHierarchyRepository extends JpaRepository<OrganisationUnitHierarchy, Long> {

    List<OrganisationUnitHierarchy> findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parent_org_unit_id, Long org_unit_level_id);
}
