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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyService {
    private static final String IMAGE_ID = "image_uuid";
    private final ImageService imageService;
    private final FormDataRepository formDataRepository;
    private final UserService userService;


    public List<String> save(Long formId, Long patientId, FormData formData, MultipartFile [] files) {
        formDataRepository.findByIdAndOrganisationUnitId(formId, userService.getUserWithRoles().get().getCurrentOrganisationUnitId())
                .orElseThrow(() -> new EntityNotFoundException(FormData.class, "formId", formId +""));

        JSONArray jsonArray = new JSONArray();
        List<String> imageUuids = new ArrayList<>();

        try {
            //Saving images
            imageUuids = imageService.uploadImage(files, patientId);
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            String formDataJsonString = mapper.writeValueAsString(formData.getData());

            JSONObject jsonObject = new JSONObject(formDataJsonString);
            if(jsonObject.has(IMAGE_ID)){
                jsonArray = jsonObject.getJSONArray(IMAGE_ID);
            }else {
                jsonObject.put(IMAGE_ID, new ArrayList<>());
            }
            for (String imageUuid : imageUuids) {
                jsonArray.put(imageUuid);
            }

            jsonObject.put(IMAGE_ID, jsonArray);
            formData.setData(jsonObject.toString());

            //Update the form data
            formDataRepository.save(formData);
            log.debug("formData saved... {}", formData);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageUuids;
    }

    public FormData getJson(String formDataString) {
        FormData formData = new FormData();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            formData = objectMapper.readValue(formDataString, FormData.class);

        } catch (IOException ioe) {
            log.info("Error", ioe.getMessage());
        }
        return formData;
    }
}