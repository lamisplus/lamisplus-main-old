package org.lamisplus.modules.base.extension.lims;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sample-manifests")
public class SampleManifestController {
    private static final String ENTITY_NAME = "sample-manifest";
    private final SampleManifestService sampleManifestService;

    @PostMapping
    public ResponseEntity<List<SampleManifest>>  save(@RequestBody SampleManifestDTO sampleManifestDTO) throws URISyntaxException {
        List<SampleManifest> result = sampleManifestService.save(sampleManifestDTO);
        return ResponseEntity.created(new URI("/api/sample-manifests/" + result.get(0).getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.get(0).getId()))).body(result);
    }

    @GetMapping ("/manifest/{id}")
    public  ResponseEntity<List<SampleManifest>>  getSampleManifestByManifestId(@PathVariable String manifestId) {
        return ResponseEntity.ok(this.sampleManifestService.getSampleManifestByManifestId(manifestId));
    }

    @GetMapping ("/undispatched")
    public  ResponseEntity<List<SampleManifest>>  getUndispatchedSampleManifest() {
        return ResponseEntity.ok(this.sampleManifestService.getUndispatchedSampleManifest());
    }

    @GetMapping ("/dispatched")
    public  ResponseEntity<List<SampleManifest>>  getDispatchedSampleManifest() {
        return ResponseEntity.ok(this.sampleManifestService.getDispatchedSampleManifest());
    }

    @GetMapping ("/pcrlab")
    public  ResponseEntity<List<PcrLab>>  getPcrLab() {
        return ResponseEntity.ok(this.sampleManifestService.getPcrLab());
    }

    @GetMapping ("/generate_manifest_id/{length}")
    public  ResponseEntity<String>  generateManifestId(int length) {
        return ResponseEntity.ok(this.sampleManifestService.generateManifestId(length));
    }


}
