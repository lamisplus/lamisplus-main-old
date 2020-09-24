package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.FormMapper;
import org.lamisplus.modules.base.repository.FormRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormService {
    private final FormRepository formRepository;
    private final ProgramRepository programRepository;
    private final FormMapper formMapper;
    private final UserService userService;
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private final GenericSpecification<Form> genericSpecification;

    public List getAllForms() {

        Specification<Form> specification = genericSpecification.findAll();

        List<Form> forms = this.formRepository.findAll(specification);
        List<FormDTO> formList = new ArrayList<>();
        forms.forEach(form -> {
            final FormDTO formDTO = formMapper.toForm(form);
            Optional<Program>  program = this.programRepository.findProgramByCode(formDTO.getProgramCode());
            program.ifPresent(value -> formDTO.setProgramName(value.getName()));
            formList.add(formDTO);
        });
        return formList;
    }


/*
    public List<Form> getAllForms() {
       List<Form> forms = this.formRepository.findAll();
        forms.forEach(form -> {
            Optional<Program>  program = this.programRepository.findProgramByUuid(form.getProgramCode());
            program.ifPresent(value -> form.setProgramName(value.getName()));
        });
        return forms;
    }
*/

    public Form save(FormDTO formDTO) {
        formDTO.setCode(UuidGenerator.getUuid());
        Optional<Form> formOptional = formRepository.findByCode(formDTO.getCode());
        if (formOptional.isPresent()) {
            throw new RecordExistException(Form.class, "Code", formDTO.getCode());
        }
        Form form = formMapper.toFormDTO(formDTO);
        form.setArchived(0);
        form.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());
        return formRepository.save(form);
    }

    public Form getForm(Long id) {
        Optional<Form> formOptional = this.formRepository.findById(id);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1) {
            throw new EntityNotFoundException(Form.class, "Id", id+"");
        }
        return formOptional.get();
    }

    public Form getFormsByFormCode(String formCode) {
        Optional<Form> formOptional = formRepository.findByCode(formCode);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1) {
            throw new EntityNotFoundException(Form.class, "Form Code", formCode);
        }
        return formOptional.get();
    }

    public List getFormsByUsageStatus(Integer usageStatus) {
        //TODO: Emeka add findAllByUsageCodeAndArchived(usageStatus, 0);
        List<Form> formList = formRepository.findAllByUsageCodeAndArchived(usageStatus, UN_ARCHIVED);
        return formList;
    }

    public Form update(Long id, FormDTO formDTO) {
        Optional<Form> formOptional = formRepository.findById(id);
        log.info("form optional  is" + formOptional.get());
        if(!formOptional.isPresent() || formOptional.get().getArchived() == ARCHIVED)throw new EntityNotFoundException(Form.class, "Id", id +"");
        //TODO: Emeka form object should set id instead of formDTO
        formDTO.setId(id);

        Form form = formMapper.toFormDTO(formDTO);
        form.setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        return formRepository.save(form);
    }

    public Integer delete(Long id) {
        Optional<Form> formOptional = formRepository.findById(id);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1)throw new EntityNotFoundException(Form.class, "Id", id +"");
        formOptional.get().setArchived(1);
        formOptional.get().setModifiedBy(userService.getUserWithAuthorities().get().getUserName());
        return formOptional.get().getArchived();
    }

    /*public Program getProgramByProgramCode(Long id) {
        Optional<Form> formOptional = formRepository.findById(id);
        if(!formOptional.isPresent())throw new EntityNotFoundException(Form.class, "Id", id +"");
        Program program = formOptional.get().getProgramByProgramCode();
        return program;
    }*/


    /*

    public FormDTO getFormByFormIdAndProgramCode(Long Id, String programCode) {
        Optional<Form> formOptional= this.formRepository.findByIdAndProgramCode(Id, programCode);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1) throw new EntityNotFoundException(Form.class, "Program Code", programCode);
        FormDTO formDTO = formMapper.toForm(formOptional.get());
        log.info("FormDTO - " + formDTO);
        return formDTO;
    }
*/

}
