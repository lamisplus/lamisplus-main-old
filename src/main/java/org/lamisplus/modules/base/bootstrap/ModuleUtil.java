package org.lamisplus.modules.base.bootstrap;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.lamisplus.modules.base.domain.entity.Module;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class ModuleUtil {
    private static List<String> classNames = new ArrayList<String>();
    private static List<Module> moduleConfigs = new ArrayList<Module>();
    private static List<File> jsonFiles = new ArrayList<File>();
    private final StorageUtil storageUtil;


    public List<String> readZipFileRecursive(final InputStream zipFile, String jarName, boolean install) {
        try (final InputStream zipFileStream = zipFile) {
            classNames.clear();
            classNames = this.readZipFileStream(zipFileStream);
        } catch (IOException e) {
            log.error("error reading zip file %s!", zipFile, e);
        }
        return classNames;
    }

    private List<String> readZipFileStream(final InputStream zipFileStream) {
        String classWordLength = ".class";
        int length = classWordLength.length();
        final ZipInputStream zipInputStream = new ZipInputStream(zipFileStream);
        ZipEntry zipEntry;
        try {
            while ((zipEntry = zipInputStream.getNextEntry()) != null) {
                log.info("name of zip entry: {}", zipEntry.getName());
                if(!zipEntry.getName().endsWith("/")){
                    String entryName = zipEntry.getName();
                    entryName = entryName.replace("/",".");

                    //Checking if file is a class file
                    if(entryName.endsWith(".class")) {
                        try {
                                log.info("name of class: {}", entryName);
                                entryName = entryName.substring(0,entryName.length() - length);
                                classNames.add(entryName.trim());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
                if (!zipEntry.isDirectory() && zipEntry.getName().endsWith(".jar")) {
                    this.readZipFileStream(zipInputStream); // recursion
                }
            }
        } catch (IOException e) {
            log.error("error reading zip file stream", e);
        }
        return classNames;
    }

    public static void copyPathFromJar(final URL jarPath, final String path, final Path target) throws Exception {
        Map<String, String> env = new HashMap<>();
        String absPath = jarPath.toString();
        URI uri = URI.create("jar:" + absPath);
        try (FileSystem zipfs = FileSystems.newFileSystem(uri, env)) {
            Path pathInZipfile = zipfs.getPath(path);
            Files.walkFileTree(pathInZipfile, new SimpleFileVisitor<Path>() {

                private Path currentTarget;

                @Override
                public FileVisitResult preVisitDirectory(final Path dir, final BasicFileAttributes attrs) throws IOException {
                    currentTarget = target.resolve(pathInZipfile.relativize(dir)
                            .toString());
                    if (!Files.exists(currentTarget)) {
                        Files.createDirectories(currentTarget);
                    }
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(final Path file, final BasicFileAttributes attrs) throws IOException {
                    Path path = Files.copy(file, target.resolve(pathInZipfile.relativize(file)
                            .toString()), StandardCopyOption.REPLACE_EXISTING);
                    File theFile = new File(path.toString());
                    //Checking for module.yml i.e. config file
                    if (theFile.getName().endsWith(".yml")) {
                        readModuleYml(theFile);
                    }
                    if (theFile.getName().endsWith(".json")) {
                        getJson(theFile);
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        }
    }

    private static void readModuleYml(File ymlFile){
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(ymlFile.getAbsolutePath())));
            Yaml yaml = new Yaml();
            Module module = yaml.loadAs(in, Module.class);
            if(module != null){
                moduleConfigs.add(module);
            }
            in.close();
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    private static void getJson(File jsonFile){
        jsonFiles.add(jsonFile);
    }

    public static List<File> getJsonFile(){
        return jsonFiles;
    }

    public static List<Module> getModuleConfigs(){
        return moduleConfigs;
    }

    public static void setModuleConfigs(){
        moduleConfigs = new ArrayList<Module>();
    }
}