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


        return formDataRepository.save(formData);
    }

    public FormData update(Long id, FormData formData) {
        Optional<FormData> formDataOptional = formDataRepository.findById(id);
        if(!formDataOptional.isPresent())throw new EntityNotFoundException(FormData.class, "Id", id +"");
        formData.setId(id);
        formData.setEncounterId(formDataOptional.get().getEncounterId());
        return formDataRepository.save(formData);
    }

    public FormData getFormData(Long id){
        Optional<FormData> formData = this.formDataRepository.findById(id);
        if (!formData.isPresent())throw new EntityNotFoundException(FormData.class, "Id", id +"");
        return formData.get();
    }

    public List<FormData> getAllFormData() {
        return formDataRepository.findAll();
    }

    public Boolean delete(Long id, FormData formData) {
        return true;
    }
}
