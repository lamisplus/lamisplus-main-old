package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.domain.entity.Drug;
import org.lamisplus.modules.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.domain.mapper.DrugMapper;
import org.lamisplus.modules.base.repository.DrugGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DrugGroupService {
    private static final int ARCHIVED = 1;
    private final DrugGroupRepository drugGroupRepository;
    private final UserService userService;
    private final DrugMapper drugMapper;


    public List<DrugGroup> getAllDrugGroups() {
        return this.drugGroupRepository.findAll();
    }

    public DrugGroup save(DrugGroup drugGroup) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(drugGroup.getId());
        if (drugGroupOptional.isPresent()) throw new RecordExistException(DrugGroup.class, "Id", drugGroup.getId() + "");
        drugGroup.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        return drugGroupRepository.save(drugGroup);
    }

    public DrugGroup getDrugGroup(Long id) {
        Optional<DrugGroup> drugGroupOptional = this.drugGroupRepository.findById(id);
        if (!drugGroupOptional.isPresent()) throw new EntityNotFoundException(DrugGroup.class, "Id", id + "");
        return drugGroupOptional.get();
    }

    public DrugGroup update(Long id, DrugGroup drugGroup) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(id);
        if(!drugGroupOptional.isPresent())throw new EntityNotFoundException(DrugGroup.class, "Id", id +"");
        drugGroup.setId(id);
        drugGroup.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return drugGroupRepository.save(drugGroup);
    }

    public List<DrugDTO> getDrugByDrugGroupId(Long id){
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(id);
        if(!drugGroupOptional.isPresent())throw new EntityNotFoundException(DrugGroup.class, "Id", id +"");
        return drugMapper.toDrugDTOList(drugGroupOptional.get().getDrugsById());
    }

    public Integer delete(Long id) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(id);
        if(!drugGroupOptional.isPresent())throw new EntityNotFoundException(DrugGroup.class, "Id", id +"");
        drugGroupOptional.get().setArchived(ARCHIVED);
        drugGroupOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return drugGroupOptional.get().getArchived();
    }
}
