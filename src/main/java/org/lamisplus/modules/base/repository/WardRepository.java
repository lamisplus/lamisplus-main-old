package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long>, JpaSpecificationExecutor {
    Boolean existsByName(String name);

    Optional<Ward> findByName(String name);
}
