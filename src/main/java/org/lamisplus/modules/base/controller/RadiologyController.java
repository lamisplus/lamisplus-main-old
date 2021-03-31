package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.bootstrap.StorageUtil;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.service.RadiologyService;
import org.springframework.http.MediaType;
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
    private final RadiologyService radiologyService;

    @PostMapping(value = "/api/radiologies/{formDataId}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<Long>> save(@PathVariable Long formDataId, @RequestPart("formDataString") String formDataString,  @RequestParam("file") MultipartFile [] files) {

        return ResponseEntity.ok(radiologyService.save(formDataId, radiologyService.getJson(formDataString), files));
    }
}
