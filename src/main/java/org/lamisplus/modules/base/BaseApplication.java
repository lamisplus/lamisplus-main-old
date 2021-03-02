package org.lamisplus.modules.base;

import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
import org.lamisplus.modules.base.bootstrap.ClassPathHacker;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;

@EnableScheduling
@SpringBootApplication
@Slf4j
public class BaseApplication extends SpringBootServletInitializer {
    private static ConfigurableApplicationContext context;

    private static Boolean isStartUp = true;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BaseApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BaseApplication.class);
        //addInitHooks(application);
        context = application.run(args);
        Log.info("java.class.path - " + System.getProperty("java.class.path"));
        ModuleService moduleService = context.getBean(ModuleService.class);
        moduleService.startModule(isStartUp);
    }

    public static void restart(Class[] clz, ConfigurableApplicationContext configurableApplicationContext) {
        if (context == null) {
            context = configurableApplicationContext;
        }

        ApplicationArguments args = context.getBean(ApplicationArguments.class);

        Thread thread = new Thread(() -> {
            /*try {
                context.close();
                for(Class cs: clz){
                    if(!cs.getName().equals("org.lamisplus.modules.base.BaseApplication")){
                        loadClass(cs.getName());
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }*/
            context = SpringApplication.run(clz, args.getSourceArgs());

        });

        thread.setDaemon(false);
        thread.start();
    }

    public static ConfigurableApplicationContext getContext() {
        return context;
    }


    /*static void addInitHooks(SpringApplication application) {
        application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
            String version = event.getEnvironment().getProperty("java.runtime.version");
            System.setProperty("java.class.path", "C:\\Users\\Dell\\Dropbox\\My PC (DESKTOP-IC75349)\\Desktop\\lamisplus-main\\demo.jar");
            String classPath = event.getEnvironment().getProperty("java.class.path");
            log.info("Running with Java {}", version);
            log.info("Classpath {}", classPath);
            try {
                String filePath = System.getProperty("user.dir")+ File.separator + "demo.jar";
                ClassPathHacker.addFile(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
            //loadClass("org.lamisplus.modules.demo.DemoModuleApplication");
        });
    }*/


    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer properties =
                new PropertySourcesPlaceholderConfigurer();
        properties.setLocation(new FileSystemResource("config.properties"));
        properties.setIgnoreResourceNotFound(true);
        return properties;
    }

    /*private void customClassLoader(){
        ClassLoader oscl =  ModuleService.getClassLoader();

        Field scl = null;
        try {
            scl = ClassLoader.class.getDeclaredField("scl");
            scl.setAccessible(true);
            scl.set(null, oscl);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }*/

    /*static void loadClass(String name){
        MyClassLoader loader = new MyClassLoader(BaseApplication.class.getClassLoader());

        System.out.println("loader name---- " +loader.getParent().getClass().getName());

        //This Loads the Class we must always
        //provide binary name of the class
        Class<?> clazz = null;
        try {
            clazz = loader.loadClass(name);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        System.out.println("Loaded class name: " + clazz.getName());

        //Create instance Of the Class and invoke the particular method
        try {
            Object instance = clazz.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }*/
}
