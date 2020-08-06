package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.Drug;
import org.lamisplus.modules.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.repository.DrugGroupRepository;
import org.lamisplus.modules.base.repository.DrugRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DrugGroupService {
    private final DrugGroupRepository drugGroupRepository;
    private final UserService userService;

    public List<DrugGroup> getAllDrugGroups() {
        return this.drugGroupRepository.findAll();
    }

    public DrugGroup save(DrugGroup drugGroup) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(drugGroup.getId());
        if (drugGroupOptional.isPresent()) throw new RecordExistException(DrugGroup.class, "Id", drugGroup.getId() + "");
        drugGroup.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
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
        drugGroup.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        return drugGroupRepository.save(drugGroup);
    }

    public List<Drug> getDrugByDrugGroupId(Long id){
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(id);
        if(!drugGroupOptional.isPresent())throw new EntityNotFoundException(DrugGroup.class, "Id", id +"");
        List<Drug> drugs = drugGroupOptional.get().getDrugsByDrugGroup();
        return drugs;
    }

    public Integer delete(Long id) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findById(id);
        if(!drugGroupOptional.isPresent())throw new EntityNotFoundException(DrugGroup.class, "Id", id +"");
        drugGroupOptional.get().setArchived(1);
        drugGroupOptional.get().setModifiedBy(userService.getUserWithAuthorities().get().getUserName());

        return drugGroupOptional.get().getArchived();
    }

}
