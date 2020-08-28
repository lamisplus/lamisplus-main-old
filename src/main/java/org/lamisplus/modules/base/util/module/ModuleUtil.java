package org.lamisplus.modules.base.util.module;


import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.entity.Module;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.CodeSource;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@Component
public class ModuleUtil {
    private static List<String> classNames = new ArrayList<String>();


    public List<String> readZipFileRecursive(final InputStream zipFile, String jarName, boolean install) {
        try (final InputStream zipFileStream = zipFile) {
            classNames.clear();
            classNames = this.readZipFileStream(zipFileStream);
        } catch (IOException e) {
            log.error("error reading zip file %s!", zipFile, e);
        }
        if(install){
            this.loadJarFile(jarName, classNames);
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
                                //entryName = entryName.replace(".class", "");

/*                                entryName = entryName.replace("BOOT-INF.", "");
                                entryName = entryName.replace("classes.", "");*/

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

    /**
     * Jar File Loader
     * @param jarName
     * @param clzNames
     */
    private void loadJarFile(String jarName, List<String> clzNames){
        JarFileLoader.loadModule(jarName, clzNames);
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
                    Files.copy(file, target.resolve(pathInZipfile.relativize(file)
                            .toString()), StandardCopyOption.REPLACE_EXISTING);
                    return FileVisitResult.CONTINUE;
                }
            });
        }
    }

    public static URL sourcePath(Class<?> clazz) {
        CodeSource codeSource = clazz.getProtectionDomain().getCodeSource();
        if (codeSource != null) {
            return codeSource.getLocation();
        }
        return null;
    }

    public static void addClassPathUrl(URL url, ClassLoader classLoader) {
        try {
            Method method = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
            method.setAccessible(true);
            method.invoke(classLoader, url);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}