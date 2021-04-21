package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.RadiologyService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


@RestController
@Slf4j
@RequiredArgsConstructor
public class RadiologyController {
    private final RadiologyService radiologyService;

    @PostMapping(value = "/api/radiologies/{formDataId}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<Long>> save(@PathVariable Long formDataId, @RequestPart("formDataString") String formDataString,  @RequestParam("file") MultipartFile [] files) {

        return ResponseEntity.ok(radiologyService.save(formDataId, radiologyService.getJson(formDataString), files));
    }
}
