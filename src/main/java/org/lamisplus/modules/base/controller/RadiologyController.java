package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.service.RadiologyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


@RestController
@Slf4j
@RequiredArgsConstructor
@Audit
public class RadiologyController {
    private final StorageUtil storageService;
    private final RadiologyService radiologyService;


    @PostMapping("/api/radiologies")
    public ResponseEntity<List<String>> save(@RequestParam Long formId, @RequestParam("file") MultipartFile [] files, Boolean overrideExistFile) {
        Path root = Paths.get("src", "main", "resources", "images");
        storageService.setRootLocation(root);
        List<String> urlList = new ArrayList<>();
        Arrays.asList(files).stream().forEach(file ->{
            // rename a file in the same directory
            String newName = UUID.randomUUID().toString().replace("-", "");
            String format = file.getContentType().replace("image/", ".");

            if(!file.getContentType().contains("image")){
                throw new IllegalTypeException(RadiologyController.class, file.getOriginalFilename(), " not an image");
            } else {
                newName = newName + format;
            }

            Path path = storageService.store(file.getOriginalFilename(), file, newName);
            String url = MvcUriComponentsBuilder
                    .fromMethodName(FileController.class, "getFile", path.getFileName().toString()).build().toString();
            urlList.add(url);
        });
        return ResponseEntity.ok(radiologyService.save(urlList, formId));
    }
}
