package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.service.UpdateService;
import org.springframework.web.bind.annotation.*;

import java.io.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/updates")
public class UpdateController {
    private final UpdateService updateService;


    @GetMapping
    public Boolean updatedAvailable() {
        return updateService.updateAvailable();
    }

    @GetMapping("/server")
    public Update checkForUpdateOnServer(@RequestParam Double version) {
        return updateService.checkForUpdateOnServer(version);
    }

    @PostMapping
    public void downloadUpdateOnServer(@RequestParam String url) throws IOException {
        updateService.downloadUpdateOnServer(url);
    }
}