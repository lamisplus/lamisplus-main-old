package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.mapper.ApplicationCodesetMapper;
import org.lamisplus.modules.base.repository.ApplicationCodesetRepository;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodeSetService {

    private final ApplicationCodesetRepository applicationCodeSetRepository;
    private final ApplicationCodesetMapper applicationCodeSetMapper;
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;

    public List<ApplicationCodesetDTO> getAllApplicationCodeSet(){
        List<ApplicationCodeSet> applicationCodeSets = applicationCodeSetRepository.findAllByArchivedOrderByIdAsc(UN_ARCHIVED);
        return applicationCodeSetMapper.toApplicationCodesetDTOList(applicationCodeSets);

    }

    public ApplicationCodeSet save(ApplicationCodesetDTO applicationCodeSetDTO){
        Optional<ApplicationCodeSet> applicationCodeSetOptional = applicationCodeSetRepository.findByDisplayAndCodesetGroupAndArchived(applicationCodeSetDTO.getDisplay(),
                applicationCodeSetDTO.getCodesetGroup(), UN_ARCHIVED);
        if (applicationCodeSetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeSet.class,"Display:",applicationCodeSetDTO.getDisplay());
        }

        final ApplicationCodeSet applicationCodeSet = applicationCodeSetMapper.toApplicationCodeset(applicationCodeSetDTO);
        applicationCodeSet.setCode(UuidGenerator.getUuid());
        return applicationCodeSetRepository.save(applicationCodeSet);
    }

    public List<ApplicationCodesetDTO> getApplicationCodeByCodeSetGroup(String codeSetGroup){
        List<ApplicationCodeSet> applicationCodeSets = applicationCodeSetRepository.findAllByCodesetGroupAndArchivedOrderByIdAsc(codeSetGroup, UN_ARCHIVED);
        return applicationCodeSetMapper.toApplicationCodesetDTOList(applicationCodeSets);

    }

    public ApplicationCodesetDTO getApplicationCodeSet(Long id){
        Optional<ApplicationCodeSet> applicationCodeSet = applicationCodeSetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodeSet.isPresent()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");
        return  applicationCodeSetMapper.toApplicationCodesetDTO(applicationCodeSet.get());
    }

    public ApplicationCodeSet update(Long id, ApplicationCodesetDTO applicationCodeSetDTO){
        Optional<ApplicationCodeSet> applicationCodeSetOptional = applicationCodeSetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodeSetOptional.isPresent()) {
            throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");
        }
        final ApplicationCodeSet applicationCodeSet = applicationCodeSetMapper.toApplicationCodeset(applicationCodeSetDTO);
        applicationCodeSet.setId(id);
        applicationCodeSet.setArchived(UN_ARCHIVED);

        return applicationCodeSetRepository.save(applicationCodeSet);
    }

    public Integer delete(Long id){
        Optional<ApplicationCodeSet> applicationCodeSetOptional = applicationCodeSetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodeSetOptional.isPresent()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");
        applicationCodeSetOptional.get().setArchived(ARCHIVED);

        return applicationCodeSetOptional.get().getArchived();
    }

    public Boolean exist(String display, String codeSetGroup){
        return applicationCodeSetRepository.existsByDisplayAndCodesetGroup(display, codeSetGroup);
    }
}
