package org.lamisplus.modules.base.extension.lims;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SampleManifestRepository extends JpaRepository<SampleManifest, Long> {

    List<SampleManifest> findAll();
    List<SampleManifest> findSampleManifestsByManifestId(String manifestId);
    List<SampleManifest> findDistinctByDispatchedFalse();
    List<SampleManifest> findSampleManifestsByDispatchedIsFalse();
    List<SampleManifest> findSampleManifestsByDispatchedIsTrue();
}

