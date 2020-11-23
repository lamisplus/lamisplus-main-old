package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.entity.ModuleDependency;
import org.lamisplus.modules.base.domain.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> , JpaSpecificationExecutor {
    Optional<Module> findByName(String name);
    //List<ModuleDependency> findByModuleDependencyByModule();
    //List<Program> findByModuleByModuleId(Long programId);
    List<Module>findAllByStatusAndBatchNo(int status, String BatchNo);
    List<Module> findAllByStatus(int status);
    List<Module> findAllByBatchNo(String batchNo);
    List<Module> findAllByModuleType(int moduleType);
}
