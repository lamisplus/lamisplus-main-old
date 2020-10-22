package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> FindByName(String name);

    @EntityGraph(attributePaths = "permissions")
    Optional<Role> FindByNameWithPermissions(String userName);

    @EntityGraph(attributePaths = "permissions")
    Optional<Role> FindByIdWithPermissions(Long id);
}
