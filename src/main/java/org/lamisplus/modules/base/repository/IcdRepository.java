package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.dto.IcdDistinctDTO;
import org.lamisplus.modules.base.domain.entity.Icd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IcdRepository extends JpaRepository<Icd, Long>, JpaSpecificationExecutor {
    Optional<Icd> findByFullCode(String fullCode);

    List<Icd> findAllByCategoryCode(String categoryCode);

    @Query("SELECT DISTINCT new org.lamisplus.modules.base.domain.dto.IcdDistinctDTO" +
            "(i.categoryCode, i.categoryTitle) FROM Icd i ORDER BY i.categoryCode")
    List<IcdDistinctDTO> findDistinctCategoryCodeAndCategoryTitle();
}