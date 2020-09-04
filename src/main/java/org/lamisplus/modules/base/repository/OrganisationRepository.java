package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
}
