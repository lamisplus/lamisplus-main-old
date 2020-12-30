package org.lamisplus.modules.base.util;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.AccessDeniedException;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class AccessRight {
    private final UserService userService;
    AtomicReference<Boolean> hasFormCode = new AtomicReference<>();


    public Boolean grantAccess(String formCode, Class clz){
        hasFormCode.set(false);
        userService.getUserWithRoles().get().getRoles().forEach(role -> {
            role.getPermissions().forEach(permission -> {
                if(permission.getName().contains(formCode)){
                    hasFormCode.set(true);
                }
            });
        });
        if(hasFormCode.get() != true){
            throw new AccessDeniedException(clz, "formCode",formCode+"" );
        }
        return hasFormCode.get();
    }

    //No need to throw an exception
    public Boolean grantAccessForm(String formCode){
        hasFormCode.set(false);
        userService.getUserWithRoles().get().getRoles().forEach(role -> {
            role.getPermissions().forEach(permission -> {
                if(permission.getName().contains(formCode)){
                    hasFormCode.set(true);
                }
            });
        });
        if(hasFormCode.get() != true){
            return null;
        }
        return hasFormCode.get();
    }

    public Boolean grantWriteAccess(String formCode, Class clz, String accessType){
        HashMap<String, Boolean> accessWrite = new HashMap<>();
        accessType = accessType.toLowerCase();
        userService.getUserWithRoles().get().getRoles().forEach(role -> {
            role.getPermissions().forEach(permission -> {
                if(permission.getName().contains(formCode)){
                    if(permission.getName().contains("write")){
                        accessWrite.put("write", true);
                    }else if(permission.getName().contains("read")){
                        accessWrite.put("read", true);
                    } else  {
                        accessWrite.put("delete", true);
                    }
                }
            });
        });
        if(accessWrite.get(accessType) != true){
            throw new AccessDeniedException(clz, "formCode",formCode+", "+accessType+" = "+ accessWrite.get(accessType));
        }else
            return accessWrite.get(accessType);
    }
}
