package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.config.AsyncConfiguration;
import org.lamisplus.modules.base.domain.entity.Update;
import org.lamisplus.modules.base.service.UpdateService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

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
    public Boolean downloadUpdateOnServer() throws ExecutionException, InterruptedException {
        CompletableFuture<Boolean> completableFuture = updateService.downloadUpdateOnServer();
        Boolean result = completableFuture.get();
        return result;
    }

    @PostMapping("/{id}")
    public Update save(@PathVariable Long id, @RequestBody Update update) {
        return updateService.save(id, update);
    }

    @GetMapping
    public Update getLatestUpdate() {
        return updateService.getLatestUpdate();
    }
}