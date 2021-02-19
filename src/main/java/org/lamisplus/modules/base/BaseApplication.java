package org.lamisplus.modules.base;

import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
import org.lamisplus.modules.base.bootstrap.ClassLoaderTest;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.beans.factory.InitializingBean;
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

import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashSet;
import java.util.Set;

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
        addInitHooks(application);
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
            try {
                context.close();
                //System.out.println("System is close");
                context = SpringApplication.run(clz, args.getSourceArgs());

            }catch (Exception e){
                e.printStackTrace();
            }
        });

        thread.setDaemon(false);
        thread.setContextClassLoader(ModuleService.getClassLoader());
        thread.start();
    }

    public static ConfigurableApplicationContext getContext() {
        return context;
    }

    /*static void addInitHooks(SpringApplication application) {
        try {
            System.setProperty("java.class.path", System.getProperty("user.dir")+ "\\runtime\\demo" +";"+System.getProperty("user.dir"));
            System.out.println(System.getProperty("java.class.path"));
            Set<String> classNames = new HashSet<>();
            classNames.add("org.lamisplus.modules.demo.DemoModuleApplication");
            ClassLoaderTest.getMain(classNames,System.getProperty("user.dir")+ "\\runtime\\demo");
        }catch (Exception e){
            e.printStackTrace();
        }
        *//*application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
            String version = event.getEnvironment().getProperty("java.runtime.version");
            log.info("Running with Java {}", version);
        });*//*
    }*/

    static void addInitHooks(SpringApplication application) {
        application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
            String version = event.getEnvironment().getProperty("java.runtime.version");
            System.setProperty("java.class.path", System.getProperty("user.dir"));
            String classPath = event.getEnvironment().getProperty("java.class.path");
            log.info("Running with Java {}", version);
            log.info("Classpath {}", classPath);

        });
    }


    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer properties =
                new PropertySourcesPlaceholderConfigurer();
        properties.setLocation(new FileSystemResource("config.properties"));
        properties.setIgnoreResourceNotFound(true);
        return properties;
    }

    private void customClassLoader(){
        ClassLoader oscl =  ModuleService.getClassLoader();

        Field scl = null;
        try {
            scl = ClassLoader.class.getDeclaredField("scl");
            scl.setAccessible(true);
            scl.set(null, oscl);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
