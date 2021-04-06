package org.lamisplus.modules.base.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.dto.DrugDTO;
import org.lamisplus.modules.base.base.domain.entity.DrugGroup;
import org.lamisplus.modules.base.base.domain.mapper.DrugMapper;
import org.lamisplus.modules.base.base.repository.DrugGroupRepository;
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
    private static final int UN_ARCHIVED = 0;
    private final DrugGroupRepository drugGroupRepository;
    private final DrugMapper drugMapper;

    public List<DrugGroup> getAllDrugGroups() {
        return this.drugGroupRepository.findAllByArchived(UN_ARCHIVED);
    }

    public DrugGroup save(DrugGroup drugGroup) {
        Optional<DrugGroup> drugGroupOptional = drugGroupRepository.findByIdAndArchived(drugGroup.getId(), UN_ARCHIVED);
        if (drugGroupOptional.isPresent()) throw new RecordExistException(DrugGroup.class, "Id", drugGroup.getId() + "");
        return drugGroupRepository.save(drugGroup);
    }

    public DrugGroup getDrugGroup(Long id) {
        return drugGroupRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(DrugGroup.class, "Id", id + ""));
    }

    public DrugGroup update(Long id, DrugGroup drugGroup) {
        drugGroupRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(DrugGroup.class, "Id", id +""));
        drugGroup.setId(id);
        return drugGroupRepository.save(drugGroup);
    }

    public List<DrugDTO> getDrugsByDrugGroupId(Long id){
        DrugGroup drugGroup = drugGroupRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(DrugGroup.class, "Id", id +""));

        return drugMapper.toDrugDTOList(drugGroup.getDrugsById());
    }

    public Integer delete(Long id) {
        DrugGroup drugGroup = drugGroupRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(DrugGroup.class, "Id", id +""));
        drugGroup.setArchived(ARCHIVED);
        drugGroupRepository.save(drugGroup);

        return drugGroup.getArchived();
    }
}
