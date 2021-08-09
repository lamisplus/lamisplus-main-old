package org.lamisplus.modules.base.config;

import lombok.RequiredArgsConstructor;
import org.audit4j.core.MetaData;
import org.audit4j.core.handler.Handler;
import org.audit4j.core.layout.Layout;
import org.audit4j.core.layout.SimpleLayout;
import org.audit4j.handler.db.DatabaseAuditHandler;
import org.audit4j.integration.spring.AuditAspect;
import org.audit4j.integration.spring.SpringAudit4jConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import javax.sql.DataSource;
import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableAspectJAutoProxy
public class AuditConfiguration {
    @Value("${spring.datasource.driver-class-name}")
    private String databaseDriver;

    @Bean
    public Layout layout() {
        return new SimpleLayout();
    }

    @Bean
    public MetaData metaData() {
        return new ApplicationMetaData();
    }

    @Bean
    public DatabaseAuditHandler databaseHandler() {
        String fileSeparator = File.separator;
        YmlFile.getDatabaseConnectionParameters(ApplicationProperties.modulePath + fileSeparator +"config.yml");
        DatabaseAuditHandler databaseHandler = new    DatabaseAuditHandler();
        databaseHandler.setEmbedded("false");
        databaseHandler.setDb_user(YmlFile.dbUser);
        databaseHandler.setDb_password(YmlFile.dbPass);
        databaseHandler.setDb_url(YmlFile.dbUrl);
        databaseHandler.setDb_driver(databaseDriver);
        return databaseHandler;
    }


    /*@Bean
    public FileAuditHandler fileAuditHandler() {
        FileAuditHandler fileAuditHandler = new FileAuditHandler();
        return fileAuditHandler;
    }*/

    /*@Bean
    public ConsoleAuditHandler consoleAuditHandler() {
        return new ConsoleAuditHandler();
    }*/


    @Bean
    public SpringAudit4jConfig springAudit4jConfig() {
        SpringAudit4jConfig audit4jConfig = new SpringAudit4jConfig();
        /*Map<String, String> props = new HashMap<>();
        props.put("log.file.location", "path");*/
        List<Handler> handlers = new ArrayList<>();
        /*handlers.add(consoleAuditHandler());
        handlers.add(fileAuditHandler());*/
        handlers.add(databaseHandler());
        audit4jConfig.setHandlers(handlers);
        audit4jConfig.setLayout(layout());
        audit4jConfig.setMetaData(metaData());
        //audit4jConfig.setProperties(props);
        return audit4jConfig;

    }

    @Bean
    public AuditAspect auditAspect() {
        return new AuditAspect();
    }
}