package org.lamisplus.modules.base.util.module;


import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Module;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
public class ModuleUtils {
    static List<String> classNames = new ArrayList<String>();


    //Load module config from module.yml and also prepare module for loading
    public static List<String> loadModuleConfig(InputStream zip, String name, List<Module> configs, String jarName, boolean install) {
        boolean isNew = install;
        try (ZipInputStream zin = new ZipInputStream(zip)) {
            log.info(zin.toString()+"just entered!!!!!!!!---path is");

            ZipEntry entry;
            while ((entry = zin.getNextEntry()) != null) {
                if(!entry.getName().endsWith("/")){
                    String changedEntry = entry.getName();
                    //preparing entry Name for Loading
                    changedEntry = changedEntry.replace("/",".");

                    //Checking if file is a class file
                    if(changedEntry.endsWith(".class")) {
                        try {
                            changedEntry = changedEntry.replace(".class","");
                            //System.out.println("changedEntry is.. "+ changedEntry);
                            //Preparing Entry Name for Loading
                            classNames.add(changedEntry.trim());

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    //log.info("Needed Entry is...."+ changedEntry);
                }
                if (entry.getName().endsWith(".jar")) {
                    //log.info(name+"loading!!!!!!! we are in jar1234567-");
                    loadModuleConfig(zin, name, configs, jarName, isNew);
                }

                //Checking for module.yml
                if (entry.getName().equals(name)) {
                    //log.info(name+"loading!!!!!!!");
                    BufferedReader in = new BufferedReader(new InputStreamReader(zin));
                    Yaml yaml = new Yaml(new Constructor(Module.class));
                    configs.add(yaml.load(in));
                    //TODO: getting Module m = yaml.load(in);
                }

                //TODO: fIX exception that is been thrown
                zin.closeEntry();
                install = false;
            }

        } catch (IOException e) {
            log.info(e.getMessage());
            e.printStackTrace();
            log.error("Could not load module.yml");
        }
        if(isNew){
            loadJarFile(jarName, classNames);
        }
        return classNames;

    }

    /**
     * Jar File Loader
     * @param jarName
     * @param clzNames
     */
    public static void loadJarFile(String jarName, List<String> clzNames){
        JarFileLoader.loadModule(jarName, clzNames);
    }

}
