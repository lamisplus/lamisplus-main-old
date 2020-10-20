package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
