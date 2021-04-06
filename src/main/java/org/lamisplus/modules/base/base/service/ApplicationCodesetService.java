package org.lamisplus.modules.base.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.base.domain.entity.ApplicationCodeset;
import org.lamisplus.modules.base.base.domain.mapper.ApplicationCodesetMapper;
import org.lamisplus.modules.base.base.repository.ApplicationCodesetRepository;
import org.lamisplus.modules.base.base.util.GenericSpecification;
import org.lamisplus.modules.base.base.util.UuidGenerator;
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
    private static final int IN_ACTIVE = 0;
    private static final int ACTIVE = 1;
    private final GenericSpecification<ApplicationCodeset> genericSpecification;



    public List<ApplicationCodesetDTO> getAllApplicationCodeset(){
        Specification<ApplicationCodeset> applicationCodesetSpecification = genericSpecification.findAllApplicationCodeset();
        List<ApplicationCodeset> applicationCodesets = applicationCodesetRepository.findAll();

        List<ApplicationCodesetDTO> applicationCodesetDTOS = new ArrayList<>();
        applicationCodesets.forEach(applicationCodeset->{
            final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset);
            applicationCodesetDTOS.add(applicationCodesetDTO);
        });
        return applicationCodesetDTOS;
    }

    public ApplicationCodeset save(ApplicationCodesetDTO applicationCodesetDTO){
        applicationCodesetDTO.setActive(ACTIVE);
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroupAndActive(applicationCodesetDTO.getDisplay(),
                applicationCodesetDTO.getCodesetGroup(), applicationCodesetDTO.getActive());
        if (applicationCodesetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeset.class,"Display:",applicationCodesetDTO.getDisplay());
        }

        final ApplicationCodeset applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
        applicationCodeset.setCode(UuidGenerator.getUuid());
        return applicationCodesetRepository.save(applicationCodeset);
    }

    public List<ApplicationCodesetDTO> getApplicationCodeByCodesetGroup(String codeSetGroup){
        List<ApplicationCodesetDTO> applicationCodesetDTOS = new ArrayList<>();
        List<ApplicationCodeset> applicationCodesetList = applicationCodesetRepository.findAllByCodesetGroupOrderByIdAsc(codeSetGroup);
        applicationCodesetList.forEach(applicationCodeset->{
            final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset);
            applicationCodesetDTOS.add(applicationCodesetDTO);
        });
        return applicationCodesetDTOS;
    }

    public ApplicationCodesetDTO getApplicationCodeset(Long id){
        Optional<ApplicationCodeset> applicationCodeset = applicationCodesetRepository.findById(id);
        if(!applicationCodeset.isPresent()) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        return  applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset.get());
    }

    public ApplicationCodeset update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findById(id);
        if(!applicationCodesetOptional.isPresent() || applicationCodesetOptional.get().getArchived() == 1) {
            throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        }
        final ApplicationCodeset applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public Integer delete(Long id){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findById(id);
        if(!applicationCodesetOptional.isPresent() || applicationCodesetOptional.get().getArchived() == 1) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        applicationCodesetOptional.get().setArchived(ARCHIVED);
        applicationCodesetOptional.get().setActive(IN_ACTIVE);
        applicationCodesetOptional.get().setModifiedBy(userService.getUserWithAuthorities().get().getUserName());

        return applicationCodesetOptional.get().getArchived();
    }

    public Boolean exist(String display, String codesetGroup){
        return applicationCodesetRepository.existsByDisplayAndCodesetGroup(display, codesetGroup);
    }
}
