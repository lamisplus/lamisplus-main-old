package org.lamisplus.modules.base.base.service.scheduler;

import jdk.nashorn.internal.runtime.options.Option;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.entity.Form;
import org.lamisplus.modules.base.base.domain.entity.Permission;
import org.lamisplus.modules.base.base.repository.FormRepository;
import org.lamisplus.modules.base.base.repository.PermissionRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
public class FormScheduler {
    private final PermissionRepository permissionRepository;
    private final FormRepository formRepository;
    private static final String READ = "read";
    private static final String WRITE = "write";
    private static final String DELETE = "delete";
    private static final String UNDERSCORE = "_";
    private static final String SPACE = " ";


    @EventListener(ApplicationReadyEvent.class)
    public void setFormPermission(){
        log.info("Form Application Ready Event");
        List<Permission> permissions = permissionRepository.findAll();
        Optional<Permission> optionalPermission = permissionRepository.findByName("form_all");

        List<String> formNames = new ArrayList();

        permissions.forEach(permission ->{
            String name = permission.getName().replace(UNDERSCORE+ WRITE, "")
                    .replace(UNDERSCORE+ READ, "").replace(UNDERSCORE+ DELETE, "");
            formNames.add(name);
        });
        List<Form> forms = formRepository.findAllByCodeNotIn(formNames);

        permissions = new ArrayList<>();
        for (Form form : forms) {
            permissions.add(new Permission(form.getCode()+UNDERSCORE+READ, form.getName() +SPACE+ READ));
            permissions.add(new Permission(form.getCode()+UNDERSCORE+WRITE, form.getName() +SPACE+ WRITE));
            permissions.add(new Permission(form.getCode()+UNDERSCORE+DELETE, form.getName() +SPACE+ DELETE));
        }

        if(!optionalPermission.isPresent()){
            permissions.add(new Permission("form_all", "All form operations"));
        }

        if(!permissions.isEmpty()) {
            permissionRepository.saveAll(permissions);
        }
    }
}
