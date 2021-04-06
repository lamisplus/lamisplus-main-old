package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State, Long>, JpaSpecificationExecutor {

}
