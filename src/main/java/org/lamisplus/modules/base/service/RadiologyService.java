package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.repository.FormDataRepository;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.DataInput;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Paths;
import java.util.Map;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyService {
    private final StorageUtil storageService;
    private final FormDataService formDataService;
    private final FormDataRepository formDataRepository;


    public String save(Long formId, MultipartFile file, Boolean overrideExistFile) {
        //Generate a new file name and save in the resources/images folder
        String fileName = UuidGenerator.getUuid().replace("-", "");

        storageService.setRootLocation(Paths.get("src", "main", "resources", "images"));
        //Upload image
        URL fileUrl = storageService.store(fileName, file, overrideExistFile, fileName);
        //Retrieve form data
        final FormData formData = formDataService.getFormData(formId);

        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            String formDataJsonString = mapper.writeValueAsString(formData.getData());

            //update the fileUrl file with the generated file full path
            JSONObject jsonObject = new JSONObject(formDataJsonString);
            if(!jsonObject.has("fileUrl")){
                jsonObject.put("fileUrl", fileUrl);
            }
            System.out.println(jsonObject);
            formData.setData(jsonObject.toString());

            //Update the form data
            formDataRepository.save(formData);


        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }

        return fileName;
    }


}
