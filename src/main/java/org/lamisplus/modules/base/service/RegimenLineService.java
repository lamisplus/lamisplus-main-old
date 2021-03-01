package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.Regimen;
import org.lamisplus.modules.base.domain.entity.RegimenLine;
import org.lamisplus.modules.base.repository.RegimenLineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RegimenLineService {

    public static final int UN_ARCHIVED = 0;
    private final RegimenLineRepository regimenLineRepository;

    public RegimenLine save(RegimenLine regimenLine) {
        Optional<RegimenLine> RegimenLine1 = regimenLineRepository.findByIdAndArchived(regimenLine.getId(), UN_ARCHIVED);
        if(RegimenLine1.isPresent())throw new RecordExistException(RegimenLine.class, "Id", regimenLine.getId() +"");
        return regimenLineRepository.save(regimenLine);
    }

    public RegimenLine update(Long id, RegimenLine regimenLine) {
        Optional<RegimenLine> regimenLineOptional = regimenLineRepository.findByIdAndArchived(regimenLine.getId(), UN_ARCHIVED);
        if(!regimenLineOptional.isPresent())throw new EntityNotFoundException(RegimenLine.class, "Id", id +"");
        regimenLine.setId(id);
        return regimenLineRepository.save(regimenLine);
    }
    public RegimenLine getRegimenLine(Long id){
        Optional<RegimenLine> regimenLineOptional = this.regimenLineRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!regimenLineOptional.isPresent())throw new EntityNotFoundException(RegimenLine.class, "Id", id +"");
        return regimenLineOptional.get();
    }

    public List<RegimenLine> getAllRegimenLines() {
        return regimenLineRepository.findAllByArchived(UN_ARCHIVED);
    }

    public List<Regimen> getRegimenByRegimenLineId(Long id){
        Optional<RegimenLine> regimenLineOptional = this.regimenLineRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!regimenLineOptional.isPresent())throw new EntityNotFoundException(RegimenLine.class, "Id", id +"");
        return regimenLineOptional.get().getRegimensById();
    }

    public Integer delete(Long id) {
        Optional<RegimenLine> regimenLineOptional = this.regimenLineRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!regimenLineOptional.isPresent())throw new EntityNotFoundException(RegimenLine.class, "Id", id +"");
        regimenLineOptional.get().setArchived(1);
        return regimenLineOptional.get().getArchived();
    }
}
