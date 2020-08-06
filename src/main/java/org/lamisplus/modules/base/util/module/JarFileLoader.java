package org.lamisplus.modules.base.util.module;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class JarFileLoader {
    private final ModuleService moduleService;

    public static void loadModule (String jarName, List<String> classNames) {
        try {
            //System.out.println("jarName is... "+jarName);
            JarClassLoader jarClassLoader = new JarClassLoader();
            JclObjectFactory factory = JclObjectFactory.getInstance();
            //list of classes
            List<Class> classList = new ArrayList();

            jarClassLoader.add("src/main/java/org/lamisplus/modules/"+jarName+".jar");
            System.out.println("loading jar file....");

            // Create object of loaded class from the ClassName List
            classNames.forEach(className ->{
                classList.add(factory.create(jarClassLoader, className).getClass());
            });


            classList.add(BaseApplication.class);
            Class[] myArray = new Class[classList.size()];
            classList.toArray(myArray);

            for(int i=0; i<myArray.length; i++){
                System.out.println("Element at the index "+i+" is ::"+myArray[i]);
            }
            BaseApplication.restart(myArray);
        }

        catch (Exception ex) {
            System.out.println ("Failed.");
            ex.printStackTrace ();
        }

    }

    public void loadExternalModulesAtStartUp(){
        JarClassLoader jarClassLoader = new JarClassLoader();
        JclObjectFactory factory = JclObjectFactory.getInstance();
        List<Class> classList = new ArrayList();
        List<Module> configs = new ArrayList<>();
        try {
            moduleService.getAllModules().forEach(module -> {
                if (module != null && module.getModuleType() == 1) {
                    try {
                        System.out.println("Loading modules...." + module.getName());
                        String jarPath = "src/main/java/org/lamisplus/modules/" + module.getName() + ".jar";
                        jarClassLoader.add(jarPath);

                        //Getting jar file
                        MultipartFile file = new MockMultipartFile(module.getName() + ".jar", new FileInputStream(new File(jarPath)));
                        ModuleUtils.loadModuleConfig(file.getInputStream(), "module.yml", configs, module.getName(), false).forEach(className -> {
                            classList.add(factory.create(jarClassLoader, className).getClass());
                        });

                    } catch (IOException ioe) {
                        ioe.printStackTrace();
                    }
                }
            });
        }catch (Exception e){
            e.printStackTrace();
        }

        System.out.println("module loaded...");

        if(classList != null && classList.size() > 0) {
            classList.add(BaseApplication.class);
            Class[] myArray = new Class[classList.size()];
            classList.toArray(myArray);

            BaseApplication.restart(myArray);
        }

    }
}