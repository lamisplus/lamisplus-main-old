package org.lamisplus.modules.base;

import com.foreach.across.config.AcrossApplication;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import com.foreach.across.modules.web.AcrossWebModule;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.bootstrap.BootstrapModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;

import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.List;

@AcrossApplication(
        modules = {
                AcrossHibernateJpaModule.NAME,
                AcrossWebModule.NAME, BootstrapModule.NAME, BaseModule.NAME
        },
        modulePackageClasses = {BootstrapModule.class})
@Slf4j
@EnableSwagger2
@EnableAsync
@EnableScheduling
public class BaseApplication extends SpringBootServletInitializer {

    private static ConfigurableApplicationContext context;

    public static void main(String[] args) {

        context = SpringApplication.run(BaseApplication.class, args);
    }


    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BaseApplication.class);
    }
}