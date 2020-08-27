package org.lamisplus.modules.base.extension.lims;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SampleManifestRepository extends JpaRepository<SampleManifest, Long> {

    @NotNull
    List<SampleManifest> findAll();
    List<SampleManifest> findSampleManifestsByManifestId(String manifestId);

    List<SampleManifest> findSampleManifestsByDispatchedIsFalse();
    List<SampleManifest> findSampleManifestsByDispatchedIsTrue();

    @Modifying
    @Query("update SampleManifest m set m.dispatched = true where m.manifestId = :manifestId")
    void flagManifestAsDispatched(@Param("manifestId") String manifestId);
}

