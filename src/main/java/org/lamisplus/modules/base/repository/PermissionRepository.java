package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
