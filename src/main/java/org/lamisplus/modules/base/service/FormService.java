package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FormDTO;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.mapper.FormMapper;
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.Constants;
import org.lamisplus.modules.base.util.JsonUtil;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormService {
    private final FormRepository formRepository;
    private final FormDataRepository formDataRepository;
    private final EncounterRepository encounterRepository;
    private final ProgramRepository programRepository;
    private final FormMapper formMapper;
    private final UserService userService;
    private static final int ARCHIVED = 1;
    private final AccessRight accessRight;
    private final PermissionRepository permissionRepository;
    private static final int UN_ARCHIVED = 0;
    private static final String READ = "Read";
    private static final String WRITE = "Write";
    private static final String DELETE = "Delete";
    private static final String UNDERSCORE = "_";
    private final Constants.ArchiveStatus constant;


    public List getAllForms() {
        List<Form> forms = formRepository.findAllByArchivedOrderByIdAsc(UN_ARCHIVED);
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

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

            String read = UNDERSCORE + READ;
            String write = UNDERSCORE + WRITE;
            String delete = UNDERSCORE + DELETE;

            permissions.add(new Permission(formDTO.getCode() + read, formDTO.getName() +" Read", constant.UN_ARCHIVED));
            permissions.add(new Permission(formDTO.getCode() + write, formDTO.getName() +" Write", constant.UN_ARCHIVED));
            permissions.add(new Permission(formDTO.getCode() + delete, formDTO.getName() +" Delete", constant.UN_ARCHIVED));
            permissionRepository.saveAll(permissions);

        return formRepository.save(form);
    }

    public Form getForm(Long id) {
        Form form = this.formRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id+""));

        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccess(form.getCode(), FormService.class, permissions);

        return form;
    }

    public Form getFormByFormCode(String formCode, Optional<Integer> formType) {
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccess(formCode, FormService.class, permissions);
        //if form is retrospective  - 1
        if (formType.isPresent() && formType.get() == 1) {
            return formRepository.findByMainCodeAndArchived(formCode, UN_ARCHIVED)
                    .orElse(formRepository.findByCodeAndArchived(formCode, UN_ARCHIVED)
                            .orElseThrow(() -> new EntityNotFoundException(Form.class, "Form Code", formCode)));
        }
        return formRepository.findByCodeAndArchived(formCode, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Form Code", formCode));
    }

    public List getFormsByUsageStatus(Integer usageStatus) {
        List<Form> forms = formRepository.findAllByUsageCodeAndArchived(usageStatus, UN_ARCHIVED);
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

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
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccessByAccessType(formDTO.getCode(), FormService.class, WRITE, permissions);
        formRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id +""));

        Form form = formMapper.toFormDTO(formDTO);
        form.setId(id);
        form.setArchived(UN_ARCHIVED);
        return formRepository.save(form);
    }

    public Integer delete(Long id) {
        Form form = formRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Form.class, "Id", id +""));
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccessByAccessType(form.getCode(), FormService.class, DELETE, permissions);

        List<Permission> permissionList = permissionRepository.findAllByNameIsLike("%"+form.getCode()+"%");
        permissionList.forEach(permission -> {
            permission.setArchived(constant.ARCHIVED);
            permissionRepository.save(permission);
        });
        form.setArchived(ARCHIVED);
        formRepository.save(form);
        return form.getArchived();
    }

    public List<String> getFormFieldNames(String formCode) {
        FormData formData = new FormData();
        Form form = formRepository.findByCodeAndArchived(formCode, UN_ARCHIVED).orElseThrow(
                () -> new EntityNotFoundException(Form.class, "Form", "" + formCode));
        List<Encounter> encounters = form.getEncountersByForm();
        if(!encounters.isEmpty()){
            Encounter encounter = encounters.stream().max(Comparator.comparing(e -> e.getId())).get();
            formData = formDataRepository.findByEncounterId(encounter.getId()).stream().max(Comparator.comparing(fd -> fd.getId())).get();
        }else {
            new EntityNotFoundException(Encounter.class, "Encounter", " for " + form.getName());
        }

        Object data = formData.getData();
        if (null != data) {
            List<String> jsonFieldNames = new ArrayList();
            return JsonUtil.traverse(JsonUtil.getJsonNode(data), jsonFieldNames, false);
        }
        return null;
    }
}