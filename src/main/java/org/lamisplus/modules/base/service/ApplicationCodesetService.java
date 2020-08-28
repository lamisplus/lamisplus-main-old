package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeset;
import org.lamisplus.modules.base.domain.mapper.ApplicationCodesetMapper;
import org.lamisplus.modules.base.repository.ApplicationCodesetRepository;
import org.lamisplus.modules.base.util.UuidGenerator;
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


    public List<ApplicationCodesetDTO> getAllApplicationCodeset(){
        List<ApplicationCodesetDTO> applicationCodesetDTOS = new ArrayList<>();
        applicationCodesetRepository.findAll().forEach(applicationCodeset->{
            final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset);
            applicationCodesetDTOS.add(applicationCodesetDTO);
        });
        return applicationCodesetDTOS;
    }

    public ApplicationCodeset save(ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroup(applicationCodesetDTO.getDisplay(), applicationCodesetDTO.getCodesetGroup());
        if (applicationCodesetOptional.isPresent()) throw new RecordExistException(ApplicationCodeset.class,"Display:",applicationCodesetDTO.getDisplay());
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
        final ApplicationCodesetDTO applicationCodesetDTO = applicationCodesetMapper.toApplicationCodesetDTO(applicationCodeset.get());
        return  applicationCodesetDTO;
    }

    public ApplicationCodeset update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findById(id);
        if(!applicationCodesetOptional.isPresent() || applicationCodesetOptional.get().getArchived() == 1) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        final ApplicationCodeset applicationCodeset = applicationCodesetMapper.toApplicationCodeset(applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public Integer delete(Long id){
        Optional<ApplicationCodeset> applicationCodesetOptional = applicationCodesetRepository.findById(id);
        if(!applicationCodesetOptional.isPresent() || applicationCodesetOptional.get().getArchived() == 1) throw new EntityNotFoundException(ApplicationCodeset.class,"Display:",id+"");
        applicationCodesetOptional.get().setArchived(1);
        applicationCodesetOptional.get().setModifiedBy(userService.getUserWithAuthorities().get().getUserName());

        return applicationCodesetOptional.get().getArchived();
    }

    public Boolean exist(String display, String codesetGroup){
        return applicationCodesetRepository.existsByDisplayAndCodesetGroup(display, codesetGroup);

    }

}
