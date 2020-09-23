package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.repository.FormDataRepository;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyService {
    private static final String FILE_URL = "fileUrl";
    private final FormDataService formDataService;
    private final FormDataRepository formDataRepository;
    //private Log log = LogFactory.getLog(RadiologyController.class);



    public List<String> save(List<String> urlList, Long formId) {
        final FormData formData = formDataService.getFormData(formId);
        List fileUrlList = new ArrayList();
        JSONArray jsonArray = new JSONArray();

        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            String formDataJsonString = mapper.writeValueAsString(formData.getData());

            JSONObject jsonObject = new JSONObject(formDataJsonString);
            if(jsonObject.has(FILE_URL)){
                jsonArray = jsonObject.getJSONArray(FILE_URL);
                }

            for (String url : urlList) {
                jsonArray.put(url);
            }
            jsonObject.put(FILE_URL, jsonArray);
            formData.setData(jsonObject.toString());

            //Update the form data
            formDataRepository.save(formData);
            log.debug("formData saved...");
            for(int i=0; i < jsonArray.length(); i++){
                fileUrlList.add(jsonArray.getString(i));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrlList;
    }
}
