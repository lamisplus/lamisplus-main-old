package org.lamisplus.modules.base.bootstrap;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entity.Module;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;


@Service
@Slf4j
public class StorageUtil {
    private Path rootLocation;

    public StorageUtil(ApplicationProperties properties) {
        this.rootLocation = Paths.get(properties.getModulePath());
    }

    public Path setRootLocation(Path path){
        return this.rootLocation = path;
    }

    public Path store(String module, MultipartFile file, String newName) {
        Path filePath;
        InputStream inputStream = null;
        module = module.toLowerCase().trim();
        String filename = StringUtils.cleanPath(file.getOriginalFilename().trim());
        if(newName != null){
            filename = newName;
        }

        try {

            if(Files.exists(rootLocation.resolve(module))){
                try {
                    Files.delete(rootLocation.resolve(module));
                }catch (NullPointerException npe){
                    throw new EntityNotFoundException(Module.class, filename, "not found");
                }
            }
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file " + filename);
            }

            if (filename.contains("..")) {
                throw new RuntimeException("Cannot store file with relative path outside current directory " + filename);
            }

            filePath = this.rootLocation.resolve(filename).toFile().toPath();
            inputStream = file.getInputStream();
            FileUtils.copyInputStreamToFile(inputStream, this.rootLocation.resolve(filename).toFile());
            inputStream.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store file " + filename, e);
        } finally {
            try {
                if (inputStream != null){inputStream.close();}
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return filePath;
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

    public URL getURL(String file) {
        try {
            return rootLocation.resolve(file).toUri().toURL();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return null;
    }
}