package org.lamisplus.modules.base.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.entity.Regimen;
import org.lamisplus.modules.base.base.repository.RegimenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RegimenService {

    private final RegimenRepository regimenRepository;

    public Regimen save(Regimen regimen) {
        Optional<Regimen> regimenOptional = regimenRepository.findById(regimen.getId());
        if(regimenOptional.isPresent())throw new RecordExistException(Regimen.class, "Id", regimen.getId() +"");
        return regimenRepository.save(regimen);
    }

    public Regimen update(Long id, Regimen regimen) {
        Optional<Regimen> regimenOptional = regimenRepository.findById(id);
        if(!regimenOptional.isPresent() || regimenOptional.get().getArchived() == 1)throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        regimen.setId(id);
        return regimenRepository.save(regimen);
    }
    public Regimen getRegimen(Long id){
        Optional<Regimen> regimenOptional = this.regimenRepository.findById(id);
        if (!regimenOptional.isPresent() || regimenOptional.get().getArchived() == 1)throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        return regimenOptional.get();
    }

    public List<Regimen> getAllRegimens() {
        return regimenRepository.findAll();
    }


    public Integer delete(Long id) {
        Optional<Regimen> regimenOptional = this.regimenRepository.findById(id);
        if (!regimenOptional.isPresent() || regimenOptional.get().getArchived() == 1)throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        regimenOptional.get().setArchived(1);
        return regimenOptional.get().getArchived();
    }
}
