package org.lamisplus.modules.base.config;

import lombok.extern.slf4j.Slf4j;
import org.jumpmind.symmetric.common.ParameterConstants;
import org.jumpmind.symmetric.web.ServerSymmetricEngine;
import org.jumpmind.symmetric.web.SymmetricEngineHolder;
import org.jumpmind.symmetric.web.SymmetricServlet;
import org.jumpmind.symmetric.web.WebConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.ServletContext;
import javax.sql.DataSource;
import java.io.*;
import java.util.Properties;

@Configuration
@Slf4j
public class SymDSModule implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    ServletContext servletContext;

    @Autowired
    DataSource dataSource;

    @Autowired
    ApplicationContext applicationContext;

    @Override
    final public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            SymmetricEngineHolder holder = new SymmetricEngineHolder();

            InputStream inputStream = new FileInputStream(ApplicationProperties.modulePath + File.separator +"symmetric.properties");
            Properties properties = new Properties();
            properties.load(inputStream);


            /*properties.put(ParameterConstants.DATA_LOADER_IGNORE_MISSING_TABLES, "true");
            properties.put(ParameterConstants.TRIGGER_CREATE_BEFORE_INITIAL_LOAD, "false");
            properties.put(ParameterConstants.AUTO_RELOAD_ENABLED, "true");
            properties.put(ParameterConstants.AUTO_REGISTER_ENABLED, "true");
            properties.put(ParameterConstants.NODE_GROUP_ID, "lamisplus-001");
            properties.put(ParameterConstants.ENGINE_NAME, "client-001");
            properties.put(ParameterConstants.SYNC_URL, "http://localhost:31415/sync/lamisplus/server");
            properties.put(ParameterConstants.REGISTRATION_URL, "");
            properties.put(ParameterConstants.EXTERNAL_ID, "main");
            properties.put(ParameterConstants.PUSH_IMMEDIATE_IF_DATA_FOUND, "main");
*/
            ServerSymmetricEngine serverSymmetricEngine = new ServerSymmetricEngine(dataSource, applicationContext, properties, false, holder);
            log.info("Application Name {}",serverSymmetricEngine.getSpringContext().getApplicationName());
            log.info("URL {}", dataSource.getConnection().getMetaData().getURL());
            serverSymmetricEngine.setDeploymentType("server");

            holder.getEngines().put(properties.getProperty(ParameterConstants.EXTERNAL_ID), serverSymmetricEngine);
            holder.setAutoStart(false);
            servletContext.setAttribute(WebConstants.ATTR_ENGINE_HOLDER, holder);

            serverSymmetricEngine.setup();
            serverSymmetricEngine.start();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Bean
    public ServletRegistrationBean<SymmetricServlet> symServlet() {
        ServletRegistrationBean<SymmetricServlet> bean = new ServletRegistrationBean<>(new SymmetricServlet(), "/sync/*");
        bean.setLoadOnStartup(1);
        return bean;
    }
}
