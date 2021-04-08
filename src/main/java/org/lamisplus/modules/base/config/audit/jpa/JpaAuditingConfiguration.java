package org.lamisplus.modules.base.config.audit.jpa;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@RequiredArgsConstructor
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfiguration {
    private final JpaAuditorAwareImpl jpaAuditorAware;

    @Bean
    public AuditorAware<String> auditorProvider() {
        return jpaAuditorAware;
    }
}
