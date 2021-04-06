package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> , JpaSpecificationExecutor {
    Optional<Module> findByName(String name);
    //List<Program> findByModuleByModuleId(Long programId);
}
