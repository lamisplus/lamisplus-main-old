package org.lamisplus.modules.base.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@ConfigurationProperties(prefix = "lamis", ignoreUnknownFields = false)
@Configuration
//@Exposed
@Getter
@Setter
public class ApplicationProperties {
    public static String tomcatBase = System.getProperty("catalina.base");
    /*private String modulePath = String.format("%s/webapps/ROOT/WEB-INF/classes/org/lamisplus/modules", tomcatBase);
    private String dotPropertiesPath = String.format("%s/webapps/ROOT/WEB-INF/classes", tomcatBase);*/


    private String modulePath = System.getProperty("user.dir");


    private String dotPropertiesPath = modulePath;

    //Paths.get("").toAbsolutePath().toString();
    private String staticPath = modulePath;//"src/main/resources/org/lamisplus/modules";
    private String databaseDir;
}