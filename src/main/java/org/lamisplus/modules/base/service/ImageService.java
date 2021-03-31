package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.entity.Image;
import org.lamisplus.modules.base.repository.ImageDbRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ImageService {
    private final ImageDbRepository imageRepository;

    public List<Long> uploadImage(MultipartFile [] multipartImages) throws Exception {
        List<Long> imageIds = new ArrayList<>();
        Arrays.asList(multipartImages).stream().forEach(file -> {
            if(!file.getContentType().contains("image")){
                throw new IllegalTypeException(Image.class, file.getOriginalFilename(), " not an image");
            }
            Image dbImage = new Image();
            dbImage.setName(file.getName());
            try {
                dbImage.setContent(file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
            imageIds.add(imageRepository.save(dbImage).getId());

        });
            return imageIds;
    }
}
