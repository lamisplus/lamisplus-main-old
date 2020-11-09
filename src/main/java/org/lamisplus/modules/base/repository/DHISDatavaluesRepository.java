package org.lamisplus.modules.base.repository;
import org.lamisplus.modules.base.domain.entity.DHISDatavalue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DHISDatavaluesRepository extends JpaRepository<DHISDatavalue, Long> , JpaSpecificationExecutor {
}
