package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.repository.LabTestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class LabTestService {
    public static final int ARCHIVED = 1;
    private final LabTestRepository labTestRepository;
    private final UserService userService;

    public List<LabTest> getAllLabTests() {
        return this.labTestRepository.findAll();
    }

    public LabTest save(LabTest labTest) {
        Optional<LabTest> labTestOptional = labTestRepository.findById(labTest.getId());
        if (labTestOptional.isPresent()) throw new RecordExistException(LabTest.class, "Id", labTest.getId() + "");
        return labTestRepository.save(labTest);
    }

    public LabTest getLabTest(Long id) {
        Optional<LabTest> labTestOptional = this.labTestRepository.findById(id);
        if (!labTestOptional.isPresent() || labTestOptional.get().getArchived() == 1) throw new EntityNotFoundException(LabTest.class, "Id", id + "");
        return labTestOptional.get();
    }

    public LabTest update(Long id, LabTest labTest) {
        Optional<LabTest> labTestOptional = labTestRepository.findById(id);
        if(!labTestOptional.isPresent() || labTestOptional.get().getArchived() == 1)throw new EntityNotFoundException(LabTest.class, "Id", id +"");
        labTest.setId(id);
        return labTestRepository.save(labTest);
    }

    public Integer delete(Long id) {
        Optional<LabTest> labTestOptional = labTestRepository.findById(id);
        if(!labTestOptional.isPresent() || labTestOptional.get().getArchived() == 1)throw new EntityNotFoundException(LabTest.class, "Id", id +"");
        labTestOptional.get().setArchived(ARCHIVED);

        return labTestOptional.get().getArchived();
    }

}
