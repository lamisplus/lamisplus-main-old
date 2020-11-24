package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.lamisplus.modules.base.domain.mapper.StandardCodesetSourceMapper;
import org.lamisplus.modules.base.repository.StandardCodesetSourceRepository;
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
public class StandardCodesetSourceService {
    private final StandardCodesetSourceRepository standardCodesetSourceRepository;
    private final StandardCodesetSourceMapper standardCodesetSourceMapper;
    private final UserService userService;
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;
    private final GenericSpecification<StandardCodesetSource> genericSpecification;



    public List<StandardCodesetSourceDTO> getAllStandardCodesetSource() {
        Specification<StandardCodesetSource> standardCodesetSourceSpecification = genericSpecification.findAll(0);
        List<StandardCodesetSource> standardCodesetSources = standardCodesetSourceRepository.findAll(standardCodesetSourceSpecification);

        List<StandardCodesetSourceDTO> standardCodesetSourceDTOS = new ArrayList<>();
        standardCodesetSources.forEach(standardCodesetSource->{
            final StandardCodesetSourceDTO standardCodesetSourceDTO = standardCodesetSourceMapper.toStandardCodesetSourceDTO(standardCodesetSource);
            standardCodesetSourceDTOS.add(standardCodesetSourceDTO);
        });
        return standardCodesetSourceDTOS;
    }

    public StandardCodesetSource save(StandardCodesetSourceDTO standardCodesetSourceDTO) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(standardCodesetSourceDTO.getId(), UN_ARCHIVED);
        if (standardCodesetSourceOptional.isPresent()) throw new RecordExistException(StandardCodesetSource.class, "Id", standardCodesetSourceDTO.getId() + "");
        final StandardCodesetSource standardCodesetSource = standardCodesetSourceMapper.toStandardCodesetSource(standardCodesetSourceDTO);

        //standardCodesetSource.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodesetSource.setArchived(UN_ARCHIVED);
        return standardCodesetSourceRepository.save(standardCodesetSource);
    }

    public StandardCodesetSourceDTO getStandardCodesetSourceById(Long id) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");

        return standardCodesetSourceMapper.toStandardCodesetSourceDTO(standardCodesetSourceOptional.get());
    }

    public StandardCodesetSource update(Long id, StandardCodesetSourceDTO standardCodesetSourceDTO) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(standardCodesetSourceDTO.getId(), UN_ARCHIVED);
        if (standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");
        final StandardCodesetSource standardCodesetSource = standardCodesetSourceMapper.toStandardCodesetSource(standardCodesetSourceDTO);

        standardCodesetSource.setId(id);
        //standardCodesetSource.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodesetSource.setArchived(UN_ARCHIVED);
        return standardCodesetSourceRepository.save(standardCodesetSource);
    }

    public Integer delete(Long id) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");
        StandardCodesetSource standardCodesetSource = standardCodesetSourceOptional.get();
        standardCodesetSource.setArchived(ARCHIVED);
        //standardCodesetSource.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        standardCodesetSourceRepository.save(standardCodesetSource);

        return ARCHIVED;
    }
}
