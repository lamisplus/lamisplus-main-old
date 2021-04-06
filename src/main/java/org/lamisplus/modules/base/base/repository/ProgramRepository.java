package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByModuleId(Long moduleId);

    String findByUuid(String Uuid);

    Optional<Program> findProgramByUuid(String Uuid);

}

