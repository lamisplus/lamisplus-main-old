package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);

    List<Permission> findByNameNotIn(List<String> name);
}
