package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor {

    @EntityGraph(attributePaths = "permission")
    Optional<Role> findByName(String name);

    @EntityGraph(attributePaths = "permission")
    Optional<Role> findById(Long id);
}
