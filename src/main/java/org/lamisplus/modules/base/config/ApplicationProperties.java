package org.lamisplus.modules.base.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "lamis", ignoreUnknownFields = false)
@Configuration
//@Exposed
@Getter
@Setter
public class ApplicationProperties {
    private String modulePath = "src/main/java/org/lamisplus/modules";
    private String staticPath = "src/main/resources/org/lamisplus/modules";
    private String databaseDir;
}