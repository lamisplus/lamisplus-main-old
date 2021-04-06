package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> , JpaSpecificationExecutor {
    List<Province> findByStateId(Long  stateId);
    Optional<Province> findByName(String provinceName);

    //List<Province> findAllByStateId(Long stateId);
}
