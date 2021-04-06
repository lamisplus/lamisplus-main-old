package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.OrganisationUnitLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganisationUnitLevelRepository extends JpaRepository<OrganisationUnitLevel, Long> {

    Optional<OrganisationUnitLevel> findByIdAndArchived(Long id, int archived);

    Optional<OrganisationUnitLevel> findByNameAndArchived(String name, int archived);

    List<OrganisationUnitLevel> findAllByArchivedOrderByIdAsc(int archived);
}
