package org.lamisplus.modules.base.base.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Getter
@Setter
public class ApplicationProperties {
    private String modulePath = System.getProperty("user.dir");
}
