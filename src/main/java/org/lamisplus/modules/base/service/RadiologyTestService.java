package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entity.RadiologyTest;
import org.lamisplus.modules.base.repository.RadiologyTestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyTestService {
    private final RadiologyTestRepository radiologyTestRepository;
    public List<RadiologyTest> getAllRadiologyTests() {
        return this.radiologyTestRepository.findAll();
    }

    public RadiologyTest getRadiologyTest(Long id) {
        Optional<RadiologyTest> radiologyTestOptional = this.radiologyTestRepository.findById(id);
        if (!radiologyTestOptional.isPresent() || radiologyTestOptional.get().getArchived() == 1) throw new EntityNotFoundException(RadiologyTest.class, "Id", id + "");
        return radiologyTestOptional.get();
    }
}
