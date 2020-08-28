package org.lamisplus.modules.base.util.module;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.test.context.support.DefaultBootstrapContext;
import org.springframework.web.multipart.MultipartFile;
import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;
import org.xeustechnologies.jcl.context.DefaultContextLoader;
import org.xeustechnologies.jcl.context.JclContext;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class JarFileLoader {
    private final ModuleService moduleService;
    private static JarClassLoader jarClassLoader;
    private static JclObjectFactory factory;
    private static List<Class> classList;
    private static String fullJarPath;
    private static String jarPath = "src/main/java/org/lamisplus/modules/";
    private final ModuleUtil moduleUtil;


    @Autowired
    ApplicationContext context;


    public static void loadModule (String jarName, List<String> classNames) {
        try {
            jarClassLoader = new JarClassLoader();
            factory = JclObjectFactory.getInstance();
            //list of classes
            classList = new ArrayList();
            fullJarPath = jarPath +jarName+".jar";

            jarClassLoader.add(fullJarPath);
            Map<String, Class> storeClass;

            /*File springBootDir = new File(fullJarPath);
            List<URL> listURL = new ArrayList<URL>();
            listURL.add(springBootDir.toURI().toURL());
            URL[] urls = new URL[listURL.size()];
            urls = listURL.toArray(urls);
            URLClassLoader cl = new URLClassLoader(urls);*/


            // Create object of loaded class from the ClassName List
            classNames.forEach(className ->{
                try {
                    System.out.println("className - "  + className);
                        classList.add(jarClassLoader.loadClass(className));

                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }



                //classList.add(factory.create(jarClassLoader, className).getClass());
            });

            DefaultContextLoader Dcontext=new DefaultContextLoader(jarClassLoader);
            Dcontext.loadContext();



            classList.add(BaseApplication.class);
            Class[] myArray = new Class[classList.size()];
            classList.toArray(myArray);

            for(int i=0; i<myArray.length; i++){
                System.out.println("Element at the index "+i+" is ::"+myArray[i]);
            }

            //BaseApplication.restart(myArray);
            //BaseApplication.testContext(myArray);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

    public void loadExternalModulesAtStartUp(){
        jarClassLoader = new JarClassLoader();
        factory = JclObjectFactory.getInstance();
        classList = new ArrayList();
        List<Module> configs = new ArrayList<>();
        try {
            moduleService.getAllModules().forEach(module -> {
                if (module != null && module.getModuleType() == 1) {
                    try {
                        System.out.println("Loading modules...." + module.getName());
                        fullJarPath = jarPath + module.getName() + ".jar";
                        jarClassLoader.add(fullJarPath);

                        //Getting jar file
                        MultipartFile file = new MockMultipartFile(module.getName() + ".jar", new FileInputStream(new File(fullJarPath)));
                        moduleUtil.readZipFileRecursive(file.getInputStream(), module.getName() + ".jar", false).forEach(className -> {
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