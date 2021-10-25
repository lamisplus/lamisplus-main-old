package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.Update;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpdateRepository extends JpaRepository<Update, Long> {

    @Query(value = "SELECT max(version) FROM update WHERE status = 3", nativeQuery = true)
    Double findMaxVersion();

    @Query(value = "SELECT * FROM update WHERE version = (SELECT max(version) FROM update WHERE status = 3)", nativeQuery = true)
    Update findUpdateByMaxVersion();

    Optional<Update> findAllByCodeAndNameAndVersion(String code, String name, Double version);

    @Query(value = "SELECT max(version) FROM update WHERE status = 1", nativeQuery = true)
    Double findMaxVersionByUpdateAvailableStatus();

    @Query(value = "SELECT * FROM update WHERE version > ?1 ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Update findByMaxVersion(Double version);

    Optional<Update> findByCodeAndVersion(String code, Double version);
}
