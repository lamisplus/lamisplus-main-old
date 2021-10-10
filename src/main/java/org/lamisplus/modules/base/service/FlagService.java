package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FlagDTO;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.domain.mapper.FlagMapper;
import org.lamisplus.modules.base.repository.FlagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FlagService {
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;
    private final FlagRepository flagRepository;
    private final FlagMapper flagMapper;


    public List<FlagDTO> getAllFlags() {
        return flagMapper.toFlagDTOList(flagRepository.findAllByArchived(UN_ARCHIVED));
    }

    public Flag save(FlagDTO flagDTO) {
        Optional<Flag> optionalFlag = flagRepository.findByNameAndFieldNameAndFieldValueAndArchived(flagDTO.getName(),
                flagDTO.getFieldName(), flagDTO.getFieldValue(), UN_ARCHIVED);
        if (optionalFlag.isPresent()) throw new RecordExistException(Flag.class, "Name", flagDTO.getName() + " with " + flagDTO.getFieldValue());
        return flagRepository.save(flagMapper.toFlag(flagDTO));
    }

    public FlagDTO getFlag(Long id) {
        Flag flag = flagRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));
        return flagMapper.toFlagDTO(flag);
    }

    public Flag update(Long id, FlagDTO flagDTO) {
        flagRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));

        flagDTO.setId(id);
        return flagRepository.save(flagMapper.toFlag(flagDTO));
    }

    public void delete(Long id) {
        Flag flag = flagRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));
        flagRepository.delete(flag);
    }
}
