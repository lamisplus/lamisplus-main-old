package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.entity.ModuleDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleDependencyRepository extends JpaRepository<ModuleDependency, Long>, JpaSpecificationExecutor {
    Optional<ModuleDependency> findByModuleId(Long moduleId);
    Optional<ModuleDependency> findByModuleIdAndArtifactId(Long moduleId, String artifactId);
}
