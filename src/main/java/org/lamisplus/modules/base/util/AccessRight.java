package org.lamisplus.modules.base.util;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.AccessDeniedException;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AccessRight {
    private final UserService userService;

    public void grantAccess(String formCode, Class clz, Set<String> permissions){
        if(permissions.contains(formCode+"_write") || permissions.contains(formCode+"_read") ||
                permissions.contains(formCode+"_delete")){
            return;
        }
        throw new AccessDeniedException(clz, "formCode",formCode+"" );
    }

    //No need to throw an exception
    public Boolean grantAccessForm(String formCode, Set<String> permissions){
        if(permissions.contains(formCode+"_write") || permissions.contains(formCode+"_read") ||
                permissions.contains(formCode+"_delete")){
            return true;
        }
        return false;
    }

    public void grantAccessByAccessType(String formCode, Class clz, String accessType, Set<String> permissions){
        accessType = accessType.toLowerCase();
        if (permissions.contains(formCode + "_" + accessType)) {
            return;
        } else if (permissions.contains(formCode + "_" + accessType)) {
            return;
        } else if (permissions.contains(formCode + "_" + accessType)) {
            return;
        }
        throw new AccessDeniedException(clz, "formCode",formCode+", "+accessType);
    }

    public Set<String> getAllPermission(){
        Set<String> permissions = new HashSet<>();
        userService.getUserWithRoles().get().getRole().forEach(roles1 ->{
            permissions.addAll(roles1.getPermission().stream().map(Permission::getName).collect(Collectors.toSet()));
        });
        return permissions;
    }
}
