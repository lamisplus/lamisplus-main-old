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


    @GetMapping("/server")
    public Update checkForUpdateOnServer(@RequestParam Double version) {
        return updateService.checkForUpdateOnServer(version);
    }

    @GetMapping("/client")
    public Boolean checkForUpdateOnClient() {
        return updateService.checkForUpdateOnClient();
    }

    @PostMapping
    public void downloadUpdateOnServer() throws IOException {
        updateService.downloadUpdateOnServer();
    }
}