package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Country;
import org.lamisplus.modules.base.domain.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepository extends JpaRepository<State, Long>, JpaSpecificationExecutor {

}
