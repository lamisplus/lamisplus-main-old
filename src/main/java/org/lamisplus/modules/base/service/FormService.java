package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.FormMapper;
import org.lamisplus.modules.base.repository.FormRepository;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormService {
    public static final int UN_ARCHIVED = 0;
    private final FormRepository formRepository;
    private final ProgramRepository programRepository;
    private final FormMapper formMapper;
    private final UserService userService;
    private static final int ARCHIVED = 1;
    private final GenericSpecification<Form> genericSpecification;
    private final AccessRight accessRight;
    private final PermissionRepository permissionRepository;


    public List getAllForms() {
        Specification<Form> specification = genericSpecification.findAll(0);

        List<Form> forms = this.formRepository.findAll(specification);
        Set<String> permissions = accessRight.getAllPermission();

        return getForms(forms, permissions);
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
        List<Permission> permissions = new ArrayList<>();
        Optional<Form> formOptional = formRepository.findByNameAndProgramCodeAndArchived(formDTO.getName(), formDTO.getProgramCode(), UN_ARCHIVED);
        if (formOptional.isPresent()) {
            throw new RecordExistException(Form.class, "Name", formDTO.getName());
        }
        Form form = formMapper.toFormDTO(formDTO);
        form.setArchived(UN_ARCHIVED);
        form.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        String read = "_read"; String write = "_write"; String delete = "_delete";
        String nameRead = formDTO.getCode()+read;
        String nameWrite = formDTO.getCode()+write;
        String nameDelete = formDTO.getCode()+delete;

        permissions.add(new Permission(nameRead, formDTO.getName() + read));

        permissions.add(new Permission(nameWrite, formDTO.getName() + write));

        permissions.add(new Permission(nameDelete, formDTO.getName() + delete));
        permissionRepository.saveAll(permissions);

        return formRepository.save(form);
    }

    public Form getForm(Long id) {
        Optional<Form> formOptional = this.formRepository.findById(id);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1) {
            throw new EntityNotFoundException(Form.class, "Id", id+"");
        }
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(formOptional.get().getCode(), FormService.class, permissions);

        return formOptional.get();
    }

    public Form getFormsByFormCode(String formCode) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(formCode, FormService.class, permissions);
        Optional<Form> formOptional = formRepository.findByCode(formCode);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == 1) {
            throw new EntityNotFoundException(Form.class, "Form Code", formCode);
        }
        return formOptional.get();
    }

    public List getFormsByUsageStatus(Integer usageStatus) {
        List<Form> forms = formRepository.findAllByUsageCodeAndArchived(usageStatus, UN_ARCHIVED);
        Set<String> permissions = accessRight.getAllPermission();

        return getForms(forms, permissions);
    }

    private List getForms(List<Form> forms, Set<String> permissions){
        List<FormDTO> formList = new ArrayList<>();
        forms.forEach(form -> {
            if(accessRight.grantAccessForm(form.getCode(), permissions) == null){
                return;
            }
            final FormDTO formDTO = formMapper.toForm(form);
            Optional<Program>  program = this.programRepository.findProgramByCode(formDTO.getProgramCode());
            program.ifPresent(value -> formDTO.setProgramName(value.getName()));
            formList.add(formDTO);
        });
        return formList;

    }

    public Form update(Long id, FormDTO formDTO) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formDTO.getCode(), FormService.class, "write", permissions);
        Optional<Form> formOptional = formRepository.findById(id);
        log.info("form optional  is" + formOptional.get());
        if(!formOptional.isPresent() || formOptional.get().getArchived() == ARCHIVED)throw new EntityNotFoundException(Form.class, "Id", id +"");

        Form form = formMapper.toFormDTO(formDTO);
        form.setId(id);
        form.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return formRepository.save(form);
    }

    public Integer delete(Long id) {
        Optional<Form> formOptional = formRepository.findById(id);
        if(!formOptional.isPresent() || formOptional.get().getArchived() == ARCHIVED)throw new EntityNotFoundException(Form.class, "Id", id +"");
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formOptional.get().getCode(), FormService.class, "delete", permissions);

        formOptional.get().setArchived(ARCHIVED);
        formOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());
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
