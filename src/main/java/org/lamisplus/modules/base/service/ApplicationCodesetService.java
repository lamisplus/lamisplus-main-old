package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeset;
import org.lamisplus.modules.base.domain.mapper.ApplicationCodesetMapper;
import org.lamisplus.modules.base.repository.ApplicationCodesetRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final GenericSpecification<ApplicationCodeset> genericSpecification;

    public List<ApplicationCodesetDTO> getAllApplicationCodeset(int active){
        Specification<ApplicationCodeset> applicationCodesetSpecification = genericSpecification.findAll(active);
        List<ApplicationCodeset> applicationCodesets = applicationCodesetRepository.findAll(applicationCodesetSpecification);

        List<ApplicationCodesetDTO> applicationCodesetDTOS = new ArrayList<>();
        applicationCodesets.forEach(applicationCodeset->{
            final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset);
            applicationCodesetDTOS.add(applicationCodesetDTO);
        });
        return applicationCodesetDTOS;
    }

    public ApplicationCodeset save(ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroupAndArchived(applicationCodesetDTO.getDisplay(),
                applicationCodesetDTO.getCodesetGroup(), UN_ARCHIVED);
        if (applicationCodesetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeset.class,"Display:",applicationCodesetDTO.getDisplay());
        }

        final ApplicationCodeset applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        applicationCodeset.setCode(UuidGenerator.getUuid());
        applicationCodeset.setArchived(UN_ARCHIVED);
        return applicationCodesetRepository.save(applicationCodeset);
    }

    public List<ApplicationCodesetDTO> getApplicationCodeByCodesetGroup(String codeSetGroup){
        List<ApplicationCodesetDTO> applicationCodesetDTOS = new ArrayList<>();
        List<ApplicationCodeset> applicationCodesetList = applicationCodesetRepository.findAllByCodesetGroupAndArchivedOrderByIdAsc(codeSetGroup, UN_ARCHIVED);
        applicationCodesetList.forEach(applicationCodeset->{
            if(applicationCodeset.getArchived() == 1){return;}
            final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset);
            applicationCodesetDTOS.add(applicationCodesetDTO);
        });
        return applicationCodesetDTOS;
    }

    public ApplicationCodesetDTO getApplicationCodeset(Long id){
        Optional<ApplicationCodeset> applicationCodeset = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodeset.isPresent()) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        return  applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset.get());
    }

    public ApplicationCodeset update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodesetOptional.isPresent()) {
            throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        }
        final ApplicationCodeset applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setArchived(UN_ARCHIVED);
        applicationCodeset.setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public Integer delete(Long id){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationCodesetOptional.isPresent()) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        applicationCodesetOptional.get().setArchived(ARCHIVED);
        applicationCodesetOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return applicationCodesetOptional.get().getArchived();
    }

    public Boolean exist(String display, String codesetGroup){
        return applicationCodesetRepository.existsByDisplayAndCodesetGroup(display, codesetGroup);
    }
}
