package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyService {

    public String save(Long formId, MultipartFile file, Boolean overrideExistFile) {
        //Generate a new file name and save in the resources/images folder
        String fileName = "";

        //Retrieve form data and update the fileUrl file with the generated file full path
        //Update the form data
        return fileName;
    }


}
