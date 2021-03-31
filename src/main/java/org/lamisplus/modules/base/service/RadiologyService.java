package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.repository.FormDataRepository;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyService {
    private static final String IMAGE_ID = "image_id";
    private final ImageService imageService;
    private final FormDataRepository formDataRepository;
    private final UserService userService;


    public Long save(Long formId, FormData formData, MultipartFile file) {
        formDataRepository.findByIdAndOrganisationUnitId(formId, userService.getUserWithRoles().get().getCurrentOrganisationUnitId())
                .orElseThrow(() -> new EntityNotFoundException(FormData.class, "formId", formId +""));
        if(!file.getContentType().contains("image")){
            throw new IllegalTypeException(RadiologyService.class, file.getOriginalFilename(), " not an image");
        }

        JSONArray jsonArray = new JSONArray();
        Long imageId = 0L;

        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            String formDataJsonString = mapper.writeValueAsString(formData.getData());

            JSONObject jsonObject = new JSONObject(formDataJsonString);
            if(jsonObject.has(IMAGE_ID)){
                jsonArray = jsonObject.getJSONArray(IMAGE_ID);
                }
            imageId = imageService.uploadImage(file);
            jsonArray.put(imageId);

            jsonObject.put(IMAGE_ID, jsonArray);
            formData.setData(jsonObject.toString());

            //Update the form data
            formDataRepository.save(formData);
            log.debug("formData saved... {}", formData);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageId;
    }
}
