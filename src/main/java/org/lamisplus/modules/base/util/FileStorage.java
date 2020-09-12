package org.lamisplus.modules.base.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.util.stream.Stream;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileStorage {
    private final Path root = Paths.get("src/main/resources/report/");

     @PostConstruct
     public void init() {
        try {
            Files.createDirectory(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public void save(MultipartFile file) {
        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public Resource load(String filename) {
       try {
            Path file = root.resolve(filename);
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

    public File load1(String filename) throws URISyntaxException {
        URL resource = getClass().getClassLoader().getResource("report1.pdf");
        if (resource == null) {
            throw new IllegalArgumentException("file not found!");
        } else {
            return new File(resource.toURI());
        }
    }

    public Resource load1() throws IOException {
        Resource resource = new ClassPathResource("report1.pdf");
        InputStream input = resource.getInputStream();
        return resource;
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public void writeBytesToFile(byte[] bFile, String fileDest) {
         fileDest = "src/main/resources/report/rep.pdf";
        try (FileOutputStream fileOuputStream = new FileOutputStream(fileDest)) {
            fileOuputStream.write(bFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
