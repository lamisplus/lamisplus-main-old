package org.lamisplus.modules.base.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.entity.FormData;
import org.lamisplus.modules.base.base.repository.FormDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FormDataService {

    private final FormDataRepository formDataRepository;
    private final UserService userService;

    public FormData save(FormData formData) {
        Optional<FormData> formDataOptional = formDataRepository.findById(formData.getId());
        if(formDataOptional.isPresent())throw new RecordExistException(FormData.class, "Id", formData.getId() +"");
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        formData.setOrganisationUnitId(organisationUnitId);

        return formDataRepository.save(formData);
    }

    public FormData update(Long id, FormData formData) {
        FormData formData1 = formDataRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(FormData.class, "Id", id +""));
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        formData.setOrganisationUnitId(organisationUnitId);
        formData.setId(id);
        formData.setEncounterId(formData1.getEncounterId());
        return formDataRepository.save(formData);
    }

    public FormData getFormData(Long id){
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        FormData formData = formDataRepository.findByIdAndOrganisationUnitId(id, organisationUnitId)
                .orElseThrow(() -> new EntityNotFoundException(FormData.class, "Id", id +""));
        return formData;
    }

    public List<FormData> getAllFormData() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        return formDataRepository.findAllByOrganisationUnitId(organisationUnitId);
    }

    public Boolean delete(Long id, FormData formData) {
        return true;
    }
}
