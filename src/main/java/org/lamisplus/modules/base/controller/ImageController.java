package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entity.Image;
import org.lamisplus.modules.base.repository.ImageRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImageController {

    private final ImageRepository imageRepository;
    //private final Image dbImage;

    @PostMapping
    public Long uploadImage(@RequestParam MultipartFile multipartImage) throws Exception {
        Image dbImage = new Image();
        dbImage.setName(multipartImage.getName());
        dbImage.setContent(multipartImage.getBytes());
        dbImage.setUuid(UUID.randomUUID().toString());

        return imageRepository.save(dbImage)
                .getId();
    }

    @GetMapping(value = "/images/{uuid}", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource downloadImage(@PathVariable String uuid) {
        byte[] image = imageRepository.findByUuid(uuid)
                .orElseThrow(() -> new EntityNotFoundException(Image.class,"UUID:",uuid+""))
                .getContent();

        return new ByteArrayResource(image);
    }
}