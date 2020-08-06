package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
