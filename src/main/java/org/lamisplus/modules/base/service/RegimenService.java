package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.RegimenDTO;
import org.lamisplus.modules.base.domain.entity.Regimen;
import org.lamisplus.modules.base.domain.mapper.RegimenMapper;
import org.lamisplus.modules.base.repository.RegimenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RegimenService {

    public static final int UN_ARCHIVED = 0;
    private final RegimenRepository regimenRepository;

    private final RegimenMapper regimenMapper;


    public RegimenDTO save(RegimenDTO regimenDTO) {
        Optional<Regimen> regimenOptional = regimenRepository.findByIdAndArchived(regimenDTO.getId(), UN_ARCHIVED);
        if(regimenOptional.isPresent())throw new RecordExistException(Regimen.class, "Id", regimenDTO.getId() +"");
        Regimen regimen = regimenMapper.toRegimen(regimenDTO);
        return regimenMapper.toRegimenDTO(regimenRepository.save(regimen));
    }

    public RegimenDTO update(Long id, RegimenDTO regimenDTO) {
        Optional<Regimen> regimenOptional = regimenRepository.findById(id);
        if(!regimenOptional.isPresent() || regimenOptional.get().getArchived() == 1)throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        regimenDTO.setId(id);
        Regimen regimen = regimenMapper.toRegimen(regimenDTO);
        return regimenMapper.toRegimenDTO(regimenRepository.save(regimen));
    }
    public RegimenDTO getRegimen(Long id){
        Optional<Regimen> regimenOptional = this.regimenRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!regimenOptional.isPresent())throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        return regimenMapper.toRegimenDTO(regimenOptional.get());
    }

    public List<RegimenDTO> getRegimensByRegimenLineId(Long regimenLineId){
        List<Regimen> regimens = this.regimenRepository.findAllByRegimenLineIdAndArchived(regimenLineId, UN_ARCHIVED);
        return regimenMapper.toRegimenDTOList(regimens);
    }

    public List<RegimenDTO> getAllRegimens() {
        return regimenMapper.toRegimenDTOList(regimenRepository.findAll());
    }


    public Integer delete(Long id) {
        Optional<Regimen> regimenOptional = this.regimenRepository.findById(id);
        if (!regimenOptional.isPresent() || regimenOptional.get().getArchived() == 1)throw new EntityNotFoundException(Regimen.class, "Id", id +"");
        regimenOptional.get().setArchived(1);
        return regimenOptional.get().getArchived();
    }
}
