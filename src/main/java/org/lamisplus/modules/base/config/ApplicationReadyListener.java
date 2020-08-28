package org.lamisplus.modules.base.config;

import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ApplicationReadyListener implements ApplicationListener<ContextRefreshedEvent> {
    private static final int STATUS_INSTALLED = 2;
    private static final int MODULE_TYPE = 1;

    @Autowired
    ModuleService moduleService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
            moduleService.loadDependenciesOfModules(STATUS_INSTALLED, MODULE_TYPE);
    }
}
