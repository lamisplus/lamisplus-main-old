package org.lamisplus.modules.base.bootstrap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Component
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DependencyLoader {
    private static final int STATUS_STARTED = 3;
    private static final int MODULE_TYPE = 1;
    private static final String TEMP = "_temp";
    private final ModuleService moduleService;
    /**
     * Fires in 5 secs and no more
     */
    @Scheduled(fixedDelay = Long.MAX_VALUE, initialDelay =1000)
    public void loadDependencies() {
        List<Module> modules = moduleService.getAllModuleByStatusAndModuleType(STATUS_STARTED, MODULE_TYPE);
        modules.forEach(module -> {
            if(module.getName().contains(TEMP)) {
                String newName = module.getName().replace(TEMP, "");
                //moduleService.changeFileNames(module.getName(), newName);
                //module.setName(newName);
                //moduleRepository.save(module);
            }
        });
        moduleService.loadDependencies(null);
    }
}
