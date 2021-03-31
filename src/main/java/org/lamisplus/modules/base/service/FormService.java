package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.FormMapper;
import org.lamisplus.modules.base.repository.FormRepository;
import org.lamisplus.modules.base.repository.PermissionRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormService {
    private final FormRepository formRepository;
    private final ProgramRepository programRepository;
    private final FormMapper formMapper;
    private final UserService userService;
    private static final int ARCHIVED = 1;
    private final AccessRight accessRight;
    private final PermissionRepository permissionRepository;
    private static final int UN_ARCHIVED = 0;
    private static final String READ = "read";
    private static final String WRITE = "write";
    private static final String DELETE = "delete";
    private static final String UNDERSCORE = "_";

    public List getAllForms() {
        List<Form> forms = formRepository.findAllByArchivedOrderByIdAsc(UN_ARCHIVED);
        Set<String> permissions = accessRight.getAllPermission();

        return getForms(forms, permissions);
    }

    public Form save(FormDTO formDTO) {
        if(formDTO.getCode() == null || formDTO.getCode().isEmpty()){
            formDTO.setCode(UUID.randomUUID().toString());
        }
        List<Permission> permissions = new ArrayList<>();
        Optional<Form> formOptional = formRepository.findByNameAndProgramCodeAndArchived(formDTO.getName(), formDTO.getProgramCode(), UN_ARCHIVED);
        if (formOptional.isPresent()) {
            throw new RecordExistException(Form.class, "Name", formDTO.getName());
        }
        Form form = formMapper.toFormDTO(formDTO);
        form.setArchived(UN_ARCHIVED);
        form.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        String read = UNDERSCORE+READ; String write = UNDERSCORE+WRITE; String delete = UNDERSCORE+DELETE;

        permissions.add(new Permission(formDTO.getCode()+read, formDTO.getName() + read));

        permissions.add(new Permission(formDTO.getCode()+write, formDTO.getName() + write));

        permissions.add(new Permission(formDTO.getCode()+delete, formDTO.getName() + delete));
        permissionRepository.saveAll(permissions);

        return formRepository.save(form);
    }

    public Form getForm(Long id) {
        Form form = this.formRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id+""));

        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(form.getCode(), FormService.class, permissions);

        return form;
    }

    public Form getFormByFormCode(String formCode) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(formCode, FormService.class, permissions);
        Form form = formRepository.findByCodeAndArchived(formCode, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Form Code", formCode));
        return form;
    }

    public List getFormsByUsageStatus(Integer usageStatus) {
        List<Form> forms = formRepository.findAllByUsageCodeAndArchived(usageStatus, UN_ARCHIVED);
        Set<String> permissions = accessRight.getAllPermission();

        return getForms(forms, permissions);
    }

    private List getForms(List<Form> forms, Set<String> permissions){
        List<FormDTO> formList = new ArrayList<>();
        forms.forEach(form -> {
            if(!accessRight.grantAccessForm(form.getCode(), permissions)){
                return;
            }
            final FormDTO formDTO = formMapper.toForm(form);
            programRepository.findProgramByCodeAndArchived(formDTO.getProgramCode(), UN_ARCHIVED)
                    .ifPresent(value -> formDTO.setProgramName(value.getName()));
            formList.add(formDTO);
        });
        return formList;

    }

    public Form update(Long id, FormDTO formDTO) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formDTO.getCode(), FormService.class, WRITE, permissions);
        Form form = formRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id +""));
        log.info("form {}" + form);

        form = formMapper.toFormDTO(formDTO);
        form.setId(id);
        return formRepository.save(form);
    }

    public Integer delete(Long id) {
        Form form = formRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id +""));
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(form.getCode(), FormService.class, DELETE, permissions);

        form.setArchived(ARCHIVED);
        formRepository.save(form);
        return form.getArchived();
    }
}