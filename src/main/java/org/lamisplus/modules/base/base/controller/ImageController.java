package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.domain.entity.Image;
import org.lamisplus.modules.base.base.repository.ImageDbRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Audit
public class ImageController {

    private final ImageDbRepository imageRepository;
    //private final Image dbImage;

    @PostMapping
    public Long uploadImage(@RequestParam MultipartFile multipartImage) throws Exception {
        Image dbImage = new Image();
        dbImage.setName(multipartImage.getName());
        dbImage.setContent(multipartImage.getBytes());

        return imageRepository.save(dbImage)
                .getId();
    }

    @GetMapping(value = "/api/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource downloadImage(@PathVariable Long id) {
        byte[] image = imageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Image.class,"Id:",id+""))
                .getContent();

        return new ByteArrayResource(image);
    }
}
