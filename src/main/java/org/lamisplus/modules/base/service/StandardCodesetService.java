package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.entity.StandardCodeset;
import org.lamisplus.modules.base.domain.entity.StandardCodeset;
import org.lamisplus.modules.base.domain.mapper.StandardCodesetMapper;
import org.lamisplus.modules.base.domain.mapper.StandardCodesetMapper;
import org.lamisplus.modules.base.repository.StandardCodesetRepository;
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
public class StandardCodesetService {
    private final StandardCodesetRepository standardCodesetRepository;
    private final StandardCodesetMapper standardCodesetMapper;
    private final UserService userService;
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;
    private final GenericSpecification<StandardCodeset> genericSpecification;



    public List<StandardCodesetDTO> getAllStandardCodeset() {
        Specification<StandardCodeset> standardCodesetSpecification = genericSpecification.findAll(0);
        List<StandardCodeset> standardCodesets = standardCodesetRepository.findAll(standardCodesetSpecification);

        List<StandardCodesetDTO> standardCodesetDTOS = new ArrayList<>();
        standardCodesets.forEach(standardCodeset->{
            final StandardCodesetDTO standardCodesetDTO = standardCodesetMapper.toStandardCodesetDTO(standardCodeset);
            standardCodesetDTOS.add(standardCodesetDTO);
        });
        return standardCodesetDTOS;
    }

    public StandardCodeset save(StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new RecordExistException(StandardCodeset.class, "Id", standardCodesetDTO.getId() + "");
        final StandardCodeset standardCodeset = standardCodesetMapper.toStandardCodeset(standardCodesetDTO);

        //standardCodeset.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodeset.setArchived(UN_ARCHIVED);
        return standardCodesetRepository.save(standardCodeset);
    }

    public StandardCodesetDTO getStandardCodesetById(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());
    }

    public StandardCodesetDTO getStandardCodesetByCode(String code) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());
    }


    public StandardCodesetDTO getStandardCodesetByApplicationCodesetId(Long applicationCodesetId) {

        /*Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());*/
        return null;
    }

    public List<StandardCodesetDTO> getAllStandardCodesetByStandardCodesetSourceId(Long standardCodesetSourceId) {
        List<StandardCodeset> standardCodesets = standardCodesetRepository.findAllByStandardCodesetSourceIdAndArchived(standardCodesetSourceId, UN_ARCHIVED);

        List<StandardCodesetDTO> standardCodesetDTOS = new ArrayList<>();
        standardCodesets.forEach(standardCodeset->{
            final StandardCodesetDTO standardCodesetDTO = standardCodesetMapper.toStandardCodesetDTO(standardCodeset);
            standardCodesetDTOS.add(standardCodesetDTO);
        });
        return standardCodesetDTOS;
    }

    public StandardCodeset update(Long id, StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        final StandardCodeset standardCodeset = standardCodesetMapper.toStandardCodeset(standardCodesetDTO);

        standardCodeset.setId(id);
        //standardCodeset.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodeset.setArchived(UN_ARCHIVED);
        return standardCodesetRepository.save(standardCodeset);
    }

    public Integer delete(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        StandardCodeset standardCodeset = standardCodesetOptional.get();
        standardCodeset.setArchived(ARCHIVED);
        //standardCodeset.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodesetRepository.save(standardCodeset);

        return ARCHIVED;
    }
}
