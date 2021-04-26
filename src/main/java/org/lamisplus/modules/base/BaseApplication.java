package org.lamisplus.modules.base;

import com.foreach.across.config.AcrossApplication;
import com.foreach.across.core.AcrossModule;
import com.foreach.across.core.context.configurer.ComponentScanConfigurer;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import com.foreach.across.modules.web.AcrossWebModule;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.bootstrap.BootstrapModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;

@EnableScheduling
@EnableSwagger2WebMvc
@AcrossApplication(
        modules = {
                AcrossHibernateJpaModule.NAME,
                AcrossWebModule.NAME, BootstrapModule.NAME
        },
        modulePackageClasses = {BootstrapModule.class})
public class BaseApplication extends AcrossModule {
    public static final String NAME = "BaseApplication";

    public static void main(String[] args) {
        SpringApplication.run(BaseApplication.class, args);

    }

    public BaseApplication() {
        super();
        addApplicationContextConfigurer(new ComponentScanConfigurer(
                getClass().getPackage().getName() +".controller",
                getClass().getPackage().getName() +".security",
                getClass().getPackage().getName() +".security.jwt",
                getClass().getPackage().getName() +".service",
                getClass().getPackage().getName() +".interceptor",
                getClass().getPackage().getName() +".config",
                getClass().getPackage().getName() +".domain",
                getClass().getPackage().getName() +".domain.mapper",
                getClass().getPackage().getName() +".util"));
    }

    /*@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BaseApplication.class);
    }*/

    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer properties = new PropertySourcesPlaceholderConfigurer();
        properties.setLocation(new FileSystemResource(ApplicationProperties.modulePath +"\\config.properties"));
        properties.setIgnoreResourceNotFound(true);
        return properties;
    }


    /*@Scheduled(fixedRate = 1000)
    public void fixedRateSch() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

        Date now = new Date();
        String strDate = sdf.format(now);
        System.out.println("Fixed Rate scheduler:: " + strDate);
    }*/

    /* @EventListener({ApplicationReadyEvent.class})
    private void applicationReadyEvent()
    {
        String url = "http://localhost:8484/login";
        if (Desktop.isDesktopSupported())
        {
            Desktop desktop = Desktop.getDesktop();
            try
            {
                desktop.browse(new URI(url));
            } catch (IOException | URISyntaxException e)
            {
                e.printStackTrace();
            }
        } else
        {
            Runtime runtime = Runtime.getRuntime();
            String[] command;

            String operatingSystemName = System.getProperty("os.name").toLowerCase();
            if (operatingSystemName.indexOf("nix") >= 0 || operatingSystemName.indexOf("nux") >= 0)
            {
                String[] browsers = {"opera", "google-chrome", "epiphany", "firefox", "mozilla", "konqueror", "netscape", "links", "lynx"};
                StringBuffer stringBuffer = new StringBuffer();

                for (int i = 0; i < browsers.length; i++)
                {
                    if (i == 0) stringBuffer.append(String.format("%s \"%s\"", browsers[i], url));
                    else stringBuffer.append(String.format(" || %s \"%s\"", browsers[i], url));
                }
                command = new String[]{"sh", "-c", stringBuffer.toString()};
            } else if (operatingSystemName.indexOf("win") >= 0)
            {
                command = new String[]{"rundll32 url.dll,FileProtocolHandler " + url};

            } else if (operatingSystemName.indexOf("mac") >= 0)
            {
                command = new String[]{"open " + url};
            } else
            {
                System.out.println("an unknown operating system!!");
                return;
            }

            try
            {
                if (command.length > 1) runtime.exec(command); // linux
                else runtime.exec(command[0]); // windows or mac
            } catch (IOException e)
            {
                e.printStackTrace();
            }
        }
    }*/

    @Override
    public String getName() {
        return NAME;
    }
}
