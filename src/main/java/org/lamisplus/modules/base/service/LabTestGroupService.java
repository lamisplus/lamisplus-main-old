package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.LabTest;
import org.lamisplus.modules.base.domain.entity.LabTestGroup;
import org.lamisplus.modules.base.repository.LabTestGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class LabTestGroupService {
    private final LabTestGroupRepository labTestGroupRepository;
    private final UserService userService;


    public List<LabTestGroup> getAllLabTestGroups() {
        return this.labTestGroupRepository.findAll();
    }

    public LabTestGroup save(LabTestGroup labTestGroup) {
        Optional<LabTestGroup> labTestGroupOptional = labTestGroupRepository.findById(labTestGroup.getId());
        if (labTestGroupOptional.isPresent()) throw new RecordExistException(LabTestGroup.class, "Id", labTestGroup.getId() + "");
        labTestGroup.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        return labTestGroupRepository.save(labTestGroup);
    }

    public LabTestGroup getLabTestGroup(Long id) {
        Optional<LabTestGroup> labTestGroupOptional = this.labTestGroupRepository.findById(id);
        if (!labTestGroupOptional.isPresent() || labTestGroupOptional.get().getArchived() == 1) throw new EntityNotFoundException(LabTestGroup.class, "Id", id + "");
        return labTestGroupOptional.get();
    }

    public LabTestGroup update(Long id, LabTestGroup labTestGroup) {
        Optional<LabTestGroup> labTestGroupOptional = labTestGroupRepository.findById(id);
        if(!labTestGroupOptional.isPresent() || labTestGroupOptional.get().getArchived() == 1)throw new EntityNotFoundException(LabTestGroup.class, "Id", id +"");
        labTestGroup.setId(id);
        labTestGroup.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return labTestGroupRepository.save(labTestGroup);
    }

    public List<LabTest> getLabTestsByLabTestGroupId(Long id){
        Optional<LabTestGroup> labTestGroupOptional = labTestGroupRepository.findById(id);
        if (!labTestGroupOptional.isPresent() || labTestGroupOptional.get().getArchived() == 1) throw new EntityNotFoundException(LabTestGroup.class, "Id", id + "");
        List<LabTest> labTests = labTestGroupOptional.get().getLabTestsByLabTestGroup();
        return labTests;
    }

    public Integer delete(Long id) {
        Optional<LabTestGroup> labTestGroupOptional = labTestGroupRepository.findById(id);
        if (!labTestGroupOptional.isPresent() || labTestGroupOptional.get().getArchived() == 1) throw new EntityNotFoundException(LabTestGroup.class, "Id", id + "");
        labTestGroupOptional.get().setArchived(1);
        labTestGroupOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return labTestGroupOptional.get().getArchived();
    }

}
