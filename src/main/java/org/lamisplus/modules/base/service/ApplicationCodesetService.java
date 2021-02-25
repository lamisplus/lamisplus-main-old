package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.mapper.ApplicationCodesetMapper;
import org.lamisplus.modules.base.repository.ApplicationCodesetRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodesetService {

    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final ApplicationCodesetMapper applicationCodesetMapper;
    private final UserService userService;
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;

    public List<ApplicationCodesetDTO> getAllApplicationCodeset(){
        List<ApplicationCodeSet> applicationCodesets = applicationCodesetRepository.findAllByArchivedOrderByIdAsc(UN_ARCHIVED);

        return applicationCodesetMapper.toApplicationCodesetDTOList(applicationCodesets);
    }

    public ApplicationCodeSet save(ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeSet> applicationCodesetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroupAndArchived(applicationCodesetDTO.getDisplay(),
                applicationCodesetDTO.getCodesetGroup(), UN_ARCHIVED);
        if (applicationCodesetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeSet.class,"Display:",applicationCodesetDTO.getDisplay());
        }

        final ApplicationCodeSet applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setCode(UuidGenerator.getUuid());
        applicationCodeset.setArchived(UN_ARCHIVED);

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public List<ApplicationCodesetDTO> getApplicationCodeByCodesetGroup(String codeSetGroup){
        List<ApplicationCodeSet> applicationCodesetList = applicationCodesetRepository.findAllByCodesetGroupAndArchivedOrderByIdAsc(codeSetGroup, UN_ARCHIVED);

        return applicationCodesetMapper.toApplicationCodesetDTOList(applicationCodesetList);
    }

    public ApplicationCodesetDTO getApplicationCodeset(Long id){
        Optional<ApplicationCodeSet> applicationCodeset = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodeset.isPresent()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");

        return  applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset.get());
    }

    public ApplicationCodeSet update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeSet> applicationCodesetOptional = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodesetOptional.isPresent()) {
            throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");
        }
        final ApplicationCodeSet applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setArchived(UN_ARCHIVED);
        return applicationCodesetRepository.save(applicationCodeset);
    }

    public Integer delete(Long id){
        Optional<ApplicationCodeSet> applicationCodesetOptional = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodesetOptional.isPresent()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+"");
        applicationCodesetOptional.get().setArchived(ARCHIVED);

        return applicationCodesetOptional.get().getArchived();
    }

    public Boolean exist(String display, String codesetGroup){
        return applicationCodesetRepository.existsByDisplayAndCodesetGroup(display, codesetGroup);
    }
}
