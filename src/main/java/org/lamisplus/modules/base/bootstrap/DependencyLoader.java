package org.lamisplus.modules.base.bootstrap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
@RequiredArgsConstructor
public class DependencyLoader {
    private final ModuleService moduleService;


    /**
     * Dead man’s solution: You will be dead before it fires again
     * Fires in 1 sec and no more
     */
    @Scheduled(fixedDelay = Long.MAX_VALUE, initialDelay =1000)
    public void loadDependencies() {
        moduleService.loadDependencies(null);
    }
}
