package org.lamisplus.modules.base.bootstrap;


import javafx.application.Application;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.domain.entity.Module;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.sql.Timestamp;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class ModuleUtil {
    private static final String APPLICATION_PROPERTIES = "application.properties";
    private static List<Module> moduleConfigs = new ArrayList<Module>();
    private static List<File> jsonFiles = new ArrayList<File>();
    private static final String YML_FILE = ".yml";
    private static final String JSON_FILE = ".json";
    private static Timestamp ts = new Timestamp(System.currentTimeMillis());
    public static Path uiPath;
    private static boolean isStatic;

    public static void copyPathFromJar(final URL jarPath, final String path, final Path target) throws Exception {
        Map<String, String> env = new HashMap<>();
        String absPath = jarPath.toString();
        URI uri = URI.create("jar:" + absPath);
        try (FileSystem zipFiles = FileSystems.newFileSystem(uri, env)) {
            Path pathInZipFile = zipFiles.getPath(path);
            Files.walkFileTree(pathInZipFile, new SimpleFileVisitor<Path>() {

                private Path currentTarget;
                private Path staticTarget;

                @Override
                public FileVisitResult preVisitDirectory(final Path dir, final BasicFileAttributes attrs) throws IOException {
                    currentTarget = target.resolve(pathInZipFile.relativize(dir)
                            .toString());
                    System.out.println(currentTarget.toFile().getName());
                    if (!Files.exists(currentTarget)) {
                        Files.createDirectories(currentTarget);
                    }
                    if (currentTarget.toFile().isDirectory() && currentTarget.toFile().getPath().contains("static")) {
                        isStatic = true;
                        staticTarget = uiPath.resolve(pathInZipFile.relativize(dir).toString());
                        if (!Files.exists(staticTarget)) {
                            Files.createDirectories(staticTarget);
                        }
                    } else {
                        isStatic = false;
                    }
                    /*if(currentTarget.toFile().isDirectory() && currentTarget.toFile().getPath().contains("modules/demo")){

                    }*/
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(final Path file, final BasicFileAttributes attrs) throws IOException {
                    Path path = Files.copy(file, target.resolve(pathInZipFile.relativize(file)
                            .toString()), StandardCopyOption.REPLACE_EXISTING);
                    File theFile = new File(path.toString());
                    //System.out.println("File name is " + theFile.getName());
                    //Checking for module.yml i.e. config file
                    if (theFile.getName().endsWith(YML_FILE)) {
                        readModuleYml(theFile);
                    } else if (theFile.getName().endsWith(JSON_FILE)) {
                        getJson(theFile);
                    } else if (theFile.getName().endsWith("properties") && !theFile.getName().contains("pom")) {
                        if (theFile.getName().contains(APPLICATION_PROPERTIES)) {
                            theFile.delete();
                        } else {
                            /*String path1 = String.format("%s/webapps/ROOT/WEB-INF/classes/", ApplicationProperties.tomcatBase);
                            System.out.println("path1 is" + path1);
                            File file1 = new File(path1 + theFile.getName());
                            if(file1 != null){
                                file1.delete();
                            }
                            System.out.println(file1.getName());
                            FileUtils.copyFile(theFile, file1);*/
                        }
                    }
                    if(isStatic){
                        Files.copy(file, uiPath.resolve(pathInZipFile.relativize(file)
                                .toString()), StandardCopyOption.REPLACE_EXISTING);
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        }catch (FileSystemNotFoundException fef){
            fef.printStackTrace();
        }
    }

    private static void readModuleYml(File ymlFile) throws IOException {
        BufferedReader in = null;
        try {
            in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(ymlFile.getAbsolutePath())));
            Yaml yaml = new Yaml();
            Module module = yaml.loadAs(in, Module.class);
            module.setBatchNo(getTimeStamp());

            if(module != null){
                moduleConfigs.add(module);
            }
            in.close();
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }finally {
            if (in != null) {in.close(); }
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
        if(moduleConfigs == null) {
            moduleConfigs = new ArrayList<Module>();
        }else moduleConfigs.clear();
    }

    public static void addModuleConfigs(Module module){
        moduleConfigs.add(module);
    }

    private static String getTimeStamp() {
        return ts.toString().replace(":", "").replace("-", "").
                replace(".","").replace(" ", "");
    }

    public static Path createUIDirectory(String moduleName){
        URL fileURL = Thread.currentThread().getContextClassLoader().getResource("static");
        Path staticPath = null;
        if(fileURL == null) {
            throw new RuntimeException("Cannot find path in classpath");
        }
        try {
            Path path = Paths.get(fileURL.toURI());
            staticPath = Paths.get(path.toString(), moduleName);

            //Creating a File object
            File file = new File(staticPath.toString());
            //Creating the directory
            if(file.mkdir()){
                System.out.println("file is "+file.getName());
            }
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        uiPath = staticPath;
        return staticPath;
    }

    public static void copyUIFiles(Path sourcePath, Path targetPath){
        File sourceLocation= new File(sourcePath.toString());
        File targetLocation = new File(targetPath.toString());

        try {
            FileUtils.copyDirectory(sourceLocation, targetLocation);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}