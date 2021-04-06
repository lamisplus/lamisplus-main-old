package org.lamisplus.modules.base.base.repository;

import org.lamisplus.modules.base.base.domain.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    Optional<LabTest> findByIdAndArchived(Long id, int archived);

    Optional<LabTest> findByNameAndLabTestGroupIdAndArchived(String name, Long labTestGroupId, int archived);

    List<LabTest> findAllByArchived(int archived);
}
