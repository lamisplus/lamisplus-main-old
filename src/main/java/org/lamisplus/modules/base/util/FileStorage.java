package org.lamisplus.modules.base.util;

import org.springframework.core.io.UrlResource;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;

import java.nio.file.Path;
import java.util.Objects;
import java.util.stream.Stream;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileStorage {
    private  Path path;

    public FileStorage() {
        Path source = Paths.get(this.getClass().getResource("/").getPath());
        this.path = Paths.get(source.toAbsolutePath() + "/report/");
    }

     @PostConstruct
     public void init() {
        try {
            Files.createDirectory(path);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }


    public void save(MultipartFile file) {
        try {
            Files.copy(file.getInputStream(), this.path.resolve(Objects.requireNonNull(file.getOriginalFilename())));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public Resource load(String fileName) {
       try {
            Path file = path.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            System.out.println("File Resource: "+resource);

           if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(path.toFile());
    }

    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.path, 1).filter(path -> !path.equals(this.path)).map(this.path::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public void writeBytesToFile(byte[] file, String fileName) {
        try (FileOutputStream fileOuputStream = new FileOutputStream(path+"/"+fileName)) {
            fileOuputStream.write(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
