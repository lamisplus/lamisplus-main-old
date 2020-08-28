package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.ApplicationCodeset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationCodesetRepository extends JpaRepository<ApplicationCodeset, Long>, JpaSpecificationExecutor {

    Optional<ApplicationCodeset> findByDisplayAndCodesetGroup(String display, String codeSetGroup);

    List<ApplicationCodeset> findAllByCodesetGroupOrderByIdAsc(String codeSetGroup);
     ApplicationCodeset findByDisplay(String display);

    Boolean existsByDisplayAndCodesetGroup(String display, String codesetGroup);

    Optional<ApplicationCodeset> findByDisplayAndCodesetGroupAndActive(String display, String codesetGroup, Integer active);
}
