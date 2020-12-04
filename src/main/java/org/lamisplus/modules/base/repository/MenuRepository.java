package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long>, JpaSpecificationExecutor {

    Optional<Menu> findByIdAndAndArchived(Long id, int archive);
}
