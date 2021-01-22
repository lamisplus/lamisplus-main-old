package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.OrganisationUnitLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganisationUnitLevelRepository extends JpaRepository<OrganisationUnitLevel, Long> {
    Optional<OrganisationUnitLevel> findByName(String name);
}
