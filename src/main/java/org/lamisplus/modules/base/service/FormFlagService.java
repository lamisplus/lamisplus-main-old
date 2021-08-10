package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FlagDTO;
import org.lamisplus.modules.base.domain.dto.FormFlagDTO;
import org.lamisplus.modules.base.domain.dto.FormFlagDTOS;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.domain.entity.FormFlag;
import org.lamisplus.modules.base.domain.entity.PatientFlag;
import org.lamisplus.modules.base.domain.mapper.FlagMapper;
import org.lamisplus.modules.base.domain.mapper.FormFlagMapper;
import org.lamisplus.modules.base.repository.FlagRepository;
import org.lamisplus.modules.base.repository.FormFlagRepository;
import org.lamisplus.modules.base.repository.PatientFlagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormFlagService {
    private static final int UN_ARCHIVED = 0;
    private final FormFlagRepository formFlagRepository;
    private final FormFlagMapper formFlagMapper;
    private final FlagService flagService;
    private final FlagMapper flagMapper;
    private final FlagRepository flagRepository;
    private final PatientFlagRepository patientFlagRepository;


    public List<FormFlagDTOS> getAllFlags() {
        List<FormFlagDTOS> formFlagDTOSList = new ArrayList<>();
        flagRepository.findAllByArchived(UN_ARCHIVED).forEach(flag -> {
            FormFlagDTOS formFlagDTOS = new FormFlagDTOS();
            formFlagDTOS.setFlag(flag);
            formFlagDTOS.setFormFlagDTOS(formFlagMapper.toFormFlagDTOs(flag.getFormsByIdFlag()));
            formFlagDTOSList.add(formFlagDTOS);
        });
        return formFlagDTOSList;
    }

    public List save(FormFlagDTOS formFlagDTOS) {
        List<FormFlag> formFlags = new ArrayList<>();
            Flag flag = new Flag();
            if(formFlagDTOS.getFlag() != null){flag = flagService.save(flagMapper.toFlagDTO(formFlagDTOS.getFlag()));}
        final Flag finalFlag = flag;
        formFlagDTOS.getFormFlagDTOS().forEach(formFlagDTO -> {
            Optional<FormFlag> optionalFormFlag = formFlagRepository.findByFormCodeAndFlagIdAndStatusAndArchived(formFlagDTO.getFormCode(),
                        finalFlag.getId(), formFlagDTO.getStatus(), UN_ARCHIVED);
            if (optionalFormFlag.isPresent()) throw new RecordExistException(FormFlag.class, "Form and Flag", "");
            formFlagDTO.setFlagId(finalFlag.getId());
            formFlags.add(formFlagMapper.toFormFlag(formFlagDTO));
            });
        if(!formFlags.isEmpty()) {
            return formFlagRepository.saveAll(formFlags);
        } return formFlags;
    }

    public FormFlag getFormFlag(Long id) {
        return formFlagRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));
    }

    public FormFlagDTOS getFlagById(Long id) {
        Flag flag =  flagRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));
        FormFlagDTOS formFlagDTOS = new FormFlagDTOS();
        formFlagDTOS.setFlag(flag);
        formFlagDTOS.setFormFlagDTOS(formFlagMapper.toFormFlagDTOs(flag.getFormsByIdFlag()));

        return formFlagDTOS;
    }

    public FormFlagDTOS update(Long id, FormFlagDTOS formFlagDTOS) {
        List<FormFlag> formFlags = new ArrayList<>();
        Flag flag = new Flag();
        if(formFlagDTOS.getFlag() != null){flag = flagService.update(id, flagMapper.toFlagDTO(formFlagDTOS.getFlag()));}
        formFlagDTOS.getFormFlagDTOS().forEach(formFlagDTO -> {
            FormFlag formFlag = formFlagRepository.findByIdAndArchived(formFlagDTO.getId(), UN_ARCHIVED)
                    .orElseThrow(() -> new EntityNotFoundException(FormFlag.class, "Form and Flag", ""));
            formFlagDTO.setId(formFlag.getId());
            formFlags.add(formFlagMapper.toFormFlag(formFlagDTO));
        });
        if(!formFlags.isEmpty()) {
            formFlagRepository.saveAll(formFlags);
        }
        formFlagDTOS.setFlag(flag);
        formFlagDTOS.setFormFlagDTOS(formFlagMapper.toFormFlagDTOs(flag.getFormsByIdFlag()));

        return formFlagDTOS;
    }

/*    public void delete(Long id) {
        FormFlag formFlag = formFlagRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(FormFlag.class, "Id", id + ""));
        formFlagRepository.delete(formFlag);
    }*/

    public void delete(Long id) {
        Flag flag = flagRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Flag.class, "Id", id + ""));
        patientFlagRepository.deleteByFlagId(flag.getId());
        formFlagRepository.deleteByFlagId(flag.getId());
        flagRepository.delete(flag);
    }
}
