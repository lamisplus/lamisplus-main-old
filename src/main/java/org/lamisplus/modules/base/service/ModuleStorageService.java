package org.lamisplus.modules.base.service;


import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.apache.commons.io.FileUtils;


@Service
@Slf4j
public class ModuleStorageService {
    private final Path rootLocation;

    public ModuleStorageService(ApplicationProperties properties) {
        this.rootLocation = Paths.get(properties.getModulePath());
    }

    public String store(String module, MultipartFile file, Boolean overrideExistFile) {
        module = module.toLowerCase().trim();
        String filename = StringUtils.cleanPath(file.getOriginalFilename().trim());
        System.out.println("file name is " + filename);

        //TODO: check...
        try {

            if(overrideExistFile == true && Files.exists(rootLocation.resolve(module))){
                    Files.delete(rootLocation.resolve(module));
            }
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file " + filename);
            }

            if (filename.contains("..")) {
                throw new RuntimeException("Cannot store file with relative path outside current directory " + filename);
            }

            InputStream inputStream = file.getInputStream();
                FileUtils.copyInputStreamToFile(inputStream, this.rootLocation.resolve(filename).toFile());
                System.out.println("this.rootLocation.resolve(filename)..." + this.rootLocation.resolve(filename).toString());

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
        return filename;
    }


    public void deleteFile(String file) {
        try {
            FileSystemUtils.deleteRecursively(rootLocation.resolve(file));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostConstruct
    public void init() {
        if (!Files.exists(rootLocation)) {
            try {
                Files.createDirectories(rootLocation);
            } catch (IOException e) {
                log.warn("Could not initialize storage: {}", e);
            }
        }
    }
}
