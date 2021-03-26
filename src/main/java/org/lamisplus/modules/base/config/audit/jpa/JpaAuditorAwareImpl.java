package org.lamisplus.modules.base.config.audit.jpa;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
public class JpaAuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        /*
          if you are using spring security, you can get the currently logged username with following code segment.
          SecurityContextHolder.getContext().getAuthentication().getName()
         */
        String userName = "";
        if(SecurityContextHolder.getContext().getAuthentication() == null){
            userName = "System";
        } else {
            userName = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        log.info("userName - ", userName);
        return Optional.ofNullable(userName);
    }
}