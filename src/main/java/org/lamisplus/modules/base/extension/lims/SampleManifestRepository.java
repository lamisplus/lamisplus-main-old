package org.lamisplus.modules.base.extension.lims;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SampleManifestRepository extends JpaRepository<SampleManifest, Long> {
    @NotNull
    List<SampleManifest> findAll();

    @NotNull
    Optional<SampleManifest> findById(Long id);

    List<SampleManifest> findSampleManifestsByManifestIdEquals(String manifestId);
    List<SampleManifest> findSampleManifestsByManifestId(String manifestId);

    List<SampleManifest> findSampleManifestsByDispatchedIsFalse();
    List<SampleManifest> findSampleManifestsByDispatchedIsTrue();

    @Query(value = "select distinct m.manifest_id from sample_manifest m where m.dispatched = ?1", nativeQuery = true)
    List<String> findManifestsDistinct(boolean dispatched);

    @Query(value = "select distinct m.manifest_id from sample_manifest m where m.dispatched = true and (m.test_result = null or m.test_result = '')", nativeQuery = true)
    List<String> findManifestsDistinct();

/*
    @Query(value = "SELECT m FROM SampleManifest m WHERE m.manifestId IN :ids")
    List<SampleManifest>findSampleManifestsByManifestIdIsInt(@Param("ids") Collection<String> ids);
*/

    @Query("select distinct new org.lamisplus.modules.base.extension.lims.ManifestDTO(m.manifestId, m.sendingFacilityId, m.sendingFacilityName, m.receivingLabId, m.receivingLabName, m.courierName, m.courierPhoneNumber, m.totalSampleShipment, m.sampleDispatchedBy, m.dateSampleDispatched, m.timeSampleDispatched) from SampleManifest m where m.dispatched = :dispatched")
    List<ManifestDTO> findSampleManifestsDistinct(@Param("dispatched") boolean dispatched);

    @Modifying
    @Query("update SampleManifest m set m.dispatched = true where m.manifestId = :manifestId")
    void flagManifestAsDispatched(@Param("manifestId") String manifestId);
}
