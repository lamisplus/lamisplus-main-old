package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.GlobalVariableDTO;
import org.lamisplus.modules.base.domain.entity.GlobalVariable;
import org.lamisplus.modules.base.domain.mapper.GlobalVariableMapper;
import org.lamisplus.modules.base.repository.GlobalVariableRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class GlobalVariableService {
    private final GlobalVariableRepository globalVariableRepository;
    private final GlobalVariableMapper globalVariableMapper;

    public GlobalVariable save(GlobalVariableDTO globalVariableDTO) {
        Optional<GlobalVariable> optional = this.globalVariableRepository.findByName(globalVariableDTO.getName());
        if (optional.isPresent()) throw new RecordExistException(GlobalVariable.class, "name", globalVariableDTO.getName());
        GlobalVariable globalVariable = this.globalVariableMapper.toGlobalVariable(globalVariableDTO);
        globalVariable.setArchived(0);
        return  globalVariableRepository.save(globalVariable);
    }

    public GlobalVariable update(Long id, GlobalVariableDTO globalVariableDTO) {
        Optional<GlobalVariable> optional = this.globalVariableRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(GlobalVariable.class, "Id", id +"");
        globalVariableDTO.setId(id);

        GlobalVariable globalVariable = globalVariableMapper.toGlobalVariable(globalVariableDTO);
        return globalVariableRepository.save(globalVariable);
    }

    public Integer delete(Long id) {
        Optional<GlobalVariable> optional = globalVariableRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(GlobalVariable.class, "Id", id +"");
        optional.get().setArchived(1);
        return optional.get().getArchived();
    }

    public GlobalVariable getGlobalVariable(Long id) {
        Optional<GlobalVariable> optional = this.globalVariableRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1) throw new EntityNotFoundException(GlobalVariable.class, "Id", id+"");
        return optional.get();
    }

    public List<GlobalVariable> getGlobalVariables() {
        GenericSpecification<GlobalVariable> genericSpecification = new GenericSpecification<GlobalVariable>();
        Specification<GlobalVariable> specification = genericSpecification.findAll(0);
        return globalVariableRepository.findAll(specification);
    }


}
