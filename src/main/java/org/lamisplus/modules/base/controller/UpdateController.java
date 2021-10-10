package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.service.UpdateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import java.io.*;

@RestController
@RequiredArgsConstructor
public class UpdateController {
    private final UpdateService updateService;

    @RequestMapping(method = RequestMethod.GET)
    public Boolean checkForUpdate() throws IOException {
        return updateService.checkForUpdate();
    }
}