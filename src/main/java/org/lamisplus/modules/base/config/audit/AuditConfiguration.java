package org.lamisplus.modules.base.config.audit;

import org.audit4j.core.MetaData;
import org.audit4j.core.handler.ConsoleAuditHandler;
import org.audit4j.core.handler.Handler;
import org.audit4j.core.handler.file.FileAuditHandler;
import org.audit4j.core.layout.Layout;
import org.audit4j.core.layout.SimpleLayout;
import org.audit4j.handler.db.DatabaseAuditHandler;
import org.audit4j.integration.spring.AuditAspect;
import org.audit4j.integration.spring.SpringAudit4jConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableAspectJAutoProxy
public class AuditConfiguration {

    private final static String EMBEDDED = "false";
    @Value("${spring.datasource.username}")
    private String user;

    @Value("${spring.datasource.password}")
    private String pd;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    /*@Value("${spring.datasource.url}")
    private String dbDriver;*/


    @Bean
    public Layout layout() {
        return new SimpleLayout();
    }

    @Bean
    public MetaData metaData() {
        return new MyMetaData();
    }

    @Bean
    public DatabaseAuditHandler databaseHandler() {
        DatabaseAuditHandler databaseHandler = new  DatabaseAuditHandler();
        databaseHandler.setEmbedded(EMBEDDED);
        databaseHandler.setDb_user(user);
        databaseHandler.setDb_password(pd);
        databaseHandler.setDb_url(dbUrl);
        databaseHandler.setDb_driver("org.postgresql.Driver");
        return databaseHandler;
    }


    /*@Bean
    public FileAuditHandler fileAuditHandler() {
        FileAuditHandler fileAuditHandler = new FileAuditHandler();
        return fileAuditHandler;
    }

    @Bean
    public ConsoleAuditHandler consoleAuditHandler() {
        return new ConsoleAuditHandler();
    }*/


    @Bean
    public SpringAudit4jConfig springAudit4jConfig() {
        SpringAudit4jConfig audit4jConfig = new SpringAudit4jConfig();
        Map<String, String> props = new HashMap<>();
        props.put("log.file.location", "path");
        List<Handler> handlers = new ArrayList<>();
        /*handlers.add(consoleAuditHandler());
        handlers.add(fileAuditHandler());*/
        handlers.add(databaseHandler());
        audit4jConfig.setHandlers(handlers);
        audit4jConfig.setLayout(layout());
        audit4jConfig.setMetaData(metaData());
        audit4jConfig.setProperties(props);
        return audit4jConfig;

    }

    @Bean
    public AuditAspect auditAspect() {
        return new AuditAspect();
    }
}
