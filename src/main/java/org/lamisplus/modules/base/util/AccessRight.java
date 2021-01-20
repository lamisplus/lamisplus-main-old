package org.lamisplus.modules.base.util;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.AccessDeniedException;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessRight {
    private final UserService userService;
    AtomicReference<Boolean> hasFormCode = new AtomicReference<>();


    public void grantAccess(String formCode, Class clz, Set<String> permissions){
        hasFormCode.set(false);
        if(permissions.contains(formCode+"_write") || permissions.contains(formCode+"_read") ||
                permissions.contains(formCode+"_delete")){
                hasFormCode.set(true);
            }
        if(hasFormCode.get() != true){
            throw new AccessDeniedException(clz, "formCode",formCode+"" );
        }
    }

    //No need to throw an exception
    public Boolean grantAccessForm(String formCode, Set<String> permissions){
        hasFormCode.set(false);
                if(permissions.contains(formCode+"_write") || permissions.contains(formCode+"_read") ||
                        permissions.contains(formCode+"_delete")){
                    hasFormCode.set(true);
                }
        if(hasFormCode.get() != true){
            return false;
        }
        return hasFormCode.get();
    }

    public void grantAccessByAccessType(String formCode, Class clz, String accessType, Set<String> permissions){
        HashMap<String, Boolean> accessWrite = new HashMap<>();
        accessType = accessType.toLowerCase();
            permissions.forEach(permission->{
                if(permission.contains(formCode+"_write")){
                    accessWrite.put("write", true);
                }else if(permission.contains(formCode+"_read")){
                    accessWrite.put("read", true);
                } else if(permission.contains(formCode+"_delete")){
                    accessWrite.put("delete", true);
                }
            });
        if(accessWrite.isEmpty() || !accessWrite.get(accessType)){
            throw new AccessDeniedException(clz, "formCode",formCode+", "+accessType+" = "+ accessWrite.get(accessType));
        }
    }

    public Set<String> getAllPermission(){
        Set<String> permissions = new HashSet<>();
        userService.getUserWithRoles().get().getRole().forEach(roles1 ->{
            permissions.addAll(roles1.getPermission().stream().map(Permission::getName).collect(Collectors.toSet()));
        });
        return permissions;
    }
}
