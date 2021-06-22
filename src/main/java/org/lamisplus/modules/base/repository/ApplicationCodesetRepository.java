package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.dto.ApplicationCodesetResponseDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationCodesetRepository extends JpaRepository<ApplicationCodeSet, Long>, JpaSpecificationExecutor {

    Optional<ApplicationCodeSet> findByDisplayAndCodesetGroup(String display, String codeSetGroup);

    //List<ApplicationCodeSet> findAllByCodesetGroupAndArchivedOrderByIdAsc(String codeSetGroup, int archived);
     ApplicationCodeSet findByDisplay(String display);

    Boolean existsByDisplayAndCodesetGroup(String display, String codesetGroup);

    Optional<ApplicationCodeSet> findByDisplayAndCodesetGroupAndArchived(String display, String codesetGroup, Integer active);

    Optional<ApplicationCodeSet> findByIdAndArchived(Long id, int archive);

    List<ApplicationCodeSet> findAllByArchivedOrderByIdAsc(int archived);

    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.ApplicationCodesetResponseDTO" +
            "(a.id, a.display, a.code) FROM ApplicationCodeSet a WHERE a.codesetGroup = ?1 and a.archived = ?2")
    List<ApplicationCodesetResponseDTO> findAllByCodesetGroupAndArchivedOrderByIdAsc(String codeSetGroup, int archived);

}
