package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.GlobalVariable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface GlobalVariableRepository extends JpaRepository <GlobalVariable, Long>, JpaSpecificationExecutor {
    Optional<GlobalVariable> findByName(String name);

}
