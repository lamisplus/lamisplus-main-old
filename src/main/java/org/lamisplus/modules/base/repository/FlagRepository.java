package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Flag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlagRepository extends JpaRepository<Flag, Long> {
    List<Flag> findAllByArchived(int archived);

    Optional<Flag> findByNameAndArchived(String name, int archived);

    Optional<Flag> findByIdAndArchived(Long id, int archived);

    Optional<Flag> findByNameAndFieldNameAndFieldValueAndArchived(String name, String fieldName, String fieldValue, int archived);
}