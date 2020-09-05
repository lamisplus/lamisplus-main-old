package org.lamisplus.modules.base.service.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class ModuleBootstrapScheduler {
    private static final int STATUS_INSTALLED = 2;
    private static final int MODULE_TYPE = 1;
    private final ModuleService moduleService;

    @Scheduled(initialDelay = 50000, fixedDelay=Long.MAX_VALUE)
    public void loadDependencies(){
        moduleService.loadDependenciesOfModules(STATUS_INSTALLED, MODULE_TYPE);
    }
}
