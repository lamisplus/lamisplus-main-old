package org.lamisplus.modules.base.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.util.upload.FilesStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@Component
@RequiredArgsConstructor
public class FilesStorageServiceImpl implements FilesStorageService {

    private String path = System.getProperty("user.dir");

    private Path root;


    @Override
    public void init() {
        try {
            root = Paths.get(path);
            Files.createDirectory(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public void save(MultipartFile file) {
        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public String uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest request){

        if (file == null || file.isEmpty()) {
            return  "Upload file is empty...";
        }
        // After the basePath is spliced, it looks like this: http://192.168.1.20:8080/fileServer
        String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        System.out.println("basePath=" + basePath);

        String fileName = file.getOriginalFilename();
        File saveFile = new File(path, fileName);
        System.out.println("File saved successfully:" + saveFile.getPath());
        try {
            file.transferTo(saveFile);//File save
        } catch (IOException e) {
            e.printStackTrace();
        }

        return saveFile.getPath().toString();
    }
}