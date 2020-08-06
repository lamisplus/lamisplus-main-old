package org.lamisplus.modules.base.extension.lims;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.extension.lims.SampleManifestDTO;
import org.lamisplus.modules.base.extension.lims.SampleManifest;
import org.lamisplus.modules.base.extension.lims.SampleManifestRepository;
import org.lamisplus.modules.base.util.RandomCodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class SampleManifestService {
    private final SampleManifestRepository sampleManifestRepository;
    private final PcrLabRespository pcrLabRespository;

    private static Object exist(Class o, String Param1, String Param2) {
        throw new RecordExistException(o, Param1, Param2);
    }

    private static Object notExit(Class o, String Param1, String Param2) {
        throw new EntityNotFoundException(o, Param1, Param2);
    }

    public List<SampleManifest> findAll(){
        return this.sampleManifestRepository.findAll();
    }

    public List<SampleManifest> save(SampleManifestDTO sampleManifestDTO) {
        List<SampleManifest> sampleManifests = new ArrayList<>();
        if (sampleManifestDTO.getSampleManifests()!= null || sampleManifestDTO.getSampleManifests().size() > 0) {
            sampleManifests = sampleManifestDTO.getSampleManifests();
            sampleManifests.forEach(sampleManifest -> {
                Optional<SampleManifest> sampleManifest1  = this.sampleManifestRepository.findById(sampleManifest.getId());
                if(sampleManifest1.isPresent()) {
                    exist(SampleManifest.class, "Manifest ID", sampleManifest.getManifestId());
                }
                //If a sample manifest exists update else save a new sample manifest
                this.sampleManifestRepository.save(sampleManifest);
            });
        }
        return sampleManifests;
    }

    public  List<SampleManifest> getSampleManifestByManifestId(String manifestId) {
        List<SampleManifest> manifest = this.sampleManifestRepository.findSampleManifestsByManifestId(manifestId);
        return manifest;
    }

    public  List<SampleManifest> getUndispatchedSampleManifest() {
        List<SampleManifest> manifest = this.sampleManifestRepository.findSampleManifestsByDispatchedIsFalse();
        return manifest;
    }

    public  List<SampleManifest> getDispatchedSampleManifest() {
        List<SampleManifest> manifest = this.sampleManifestRepository.findSampleManifestsByDispatchedIsTrue();
        return manifest;
    }

    public  List<PcrLab> getPcrLab() {
        List<PcrLab> pcrLabs = this.pcrLabRespository.findAll();
        return pcrLabs;
    }

    public String generateManifestId(int length) {
        return RandomCodeGenerator.randomAlphanumericString(length);
    }
}

