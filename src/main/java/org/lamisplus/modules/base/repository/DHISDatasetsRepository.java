package org.lamisplus.modules.base.repository;
import org.lamisplus.modules.base.domain.entity.DHISDataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DHISDatasetsRepository extends JpaRepository<DHISDataset, Long> , JpaSpecificationExecutor {
    Boolean existsDHISDatasetById(Long datasetId);
}