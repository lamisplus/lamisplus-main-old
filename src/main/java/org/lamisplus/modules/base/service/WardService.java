package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.WardDTO;
import org.lamisplus.modules.base.domain.entity.Ward;
import org.lamisplus.modules.base.domain.mapper.WardMapper;
import org.lamisplus.modules.base.repository.WardRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
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
public class WardService {
    private final WardRepository wardRepository;
    private final WardMapper wardMapper;
    private final UserService userService;



    public List<WardDTO> getAllWards(){
        List<WardDTO> wardDTOS = new ArrayList<>();
        GenericSpecification<Ward> genericSpecification = new GenericSpecification<Ward>();
        Specification<Ward> specification = genericSpecification.findAll(0);
        List<Ward> wardList = wardRepository.findAll(specification);

        wardList.forEach(ward->{
            final WardDTO wardDTO = wardMapper.toWardDTO(ward);
            wardDTOS.add(wardDTO);
        });
        return wardDTOS;
    }

    public Ward save(WardDTO wardDTO){
        log.info("wardDTO is.. "+wardDTO);
        Optional<Ward> wardOptional = wardRepository.findByName(wardDTO.getName());
        if (wardOptional.isPresent()) throw new RecordExistException(Ward.class,"Name:",wardDTO.getName());
        final Ward ward = wardMapper.toWard(wardDTO);
        log.info("ward is.. "+ward);
        ward.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
        return wardRepository.save(ward);
    }


    public WardDTO getWard(Long id){
        Optional<Ward> wardOptional = wardRepository.findById(id);
        if(!wardOptional.isPresent() || wardOptional.get().getArchived() == 1) throw new EntityNotFoundException(Ward.class,"Id:",id+"");
        final WardDTO wardDTO = wardMapper.toWardDTO(wardOptional.get());
        return  wardDTO;
    }

    public Ward update(Long id, WardDTO wardDTO){
        Optional<Ward> wardOptional = wardRepository.findById(id);
        if(!wardOptional.isPresent() || wardOptional.get().getArchived() == 1) throw new EntityNotFoundException(Ward.class,"Id:",id+"");
        final Ward ward = wardMapper.toWard(wardDTO);
        ward.setId(id);
        ward.setUuid(wardOptional.get().getUuid());
        ward.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        return wardRepository.save(ward);
    }

    public Integer delete(Long id){
        Optional<Ward> wardOptional = wardRepository.findById(id);
        if(!wardOptional.isPresent() || wardOptional.get().getArchived() == 1) throw new EntityNotFoundException(Ward.class,"Id:",id+"");
        wardOptional.get().setArchived(1);
        wardOptional.get().setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        return wardOptional.get().getArchived();
    }

    public Boolean exist(String name){
        return wardRepository.existsByName(name);
    }

}
