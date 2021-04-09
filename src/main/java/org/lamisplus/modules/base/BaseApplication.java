package org.lamisplus.modules.base;

import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
//import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@EnableScheduling
@SpringBootApplication
@Slf4j
public class BaseApplication extends SpringBootServletInitializer {
    private static ConfigurableApplicationContext context;

    private static Boolean isStartUp = true;

    @Value("${base.url}")
    private static String url;

    private static String command = "rundll32 url.dll,FileProtocolHandler ";

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BaseApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BaseApplication.class);
        context = application.run(args);
        Log.info("java.class.path - " + System.getProperty("java.class.path"));
      //  ModuleService moduleService = context.getBean(ModuleService.class);
       // moduleService.startModule(isStartUp);
        if(url == null){
            url = "http://localhost:8080";
        }
        browse(url +"/login");
    }

    public static void restart(Class[] clz, ConfigurableApplicationContext configurableApplicationContext) {
        if (context == null) {
            context = configurableApplicationContext;
        }

        ApplicationArguments args = context.getBean(ApplicationArguments.class);

        Thread thread = new Thread(() -> {
            context.close();
            context = SpringApplication.run(clz, args.getSourceArgs());
        });

        thread.setDaemon(false);
        thread.start();
    }

    public static ConfigurableApplicationContext getContext() {
        return context;
    }


    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer properties =
                new PropertySourcesPlaceholderConfigurer();
        properties.setLocation(new FileSystemResource("config.properties"));
        properties.setIgnoreResourceNotFound(true);
        return properties;
    }

    //starting the default browser
    public static void browse(String url) {
        if(Desktop.isDesktopSupported()){
            Desktop desktop = Desktop.getDesktop();
            try {
                desktop.browse(new URI(url));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        }else{
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec(command + url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
