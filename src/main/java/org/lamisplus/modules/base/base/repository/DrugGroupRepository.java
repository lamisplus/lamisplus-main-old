package org.lamisplus.modules.base.base.repository;


import org.lamisplus.modules.base.base.domain.entity.DrugGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrugGroupRepository extends JpaRepository<DrugGroup, Long> {
}
