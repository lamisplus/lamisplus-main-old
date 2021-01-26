package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long>, JpaSpecificationExecutor {
    List<Program> findByModuleId(Long moduleId);

    //String findByCode(String Code);

    //Optional<Program> findProgramByName(String Name);

    Optional<Program> findProgramByModuleIdAndName(Long moduleId, String name);

    //Optional<Program> findByModuleId(Long moduleId);

    String findByCode(String Code);

    Optional<Program> findProgramByCodeAndArchived(String Code, int archived);


}

