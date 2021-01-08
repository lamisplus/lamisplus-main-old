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


    public void grantAccess(String formCode, Class clz){
        hasFormCode.set(false);
        userService.getUserWithRoles().get().getRole().forEach(role -> {
            role.getPermission().forEach(permission -> {
                if(permission.getName().contains(formCode)){
                    hasFormCode.set(true);
                }
            });
        });
        if(hasFormCode.get() != true){
            throw new AccessDeniedException(clz, "formCode",formCode+"" );
        }
    }

    //No need to throw an exception
    public Boolean grantAccessForm(String formCode){
        hasFormCode.set(false);
        userService.getUserWithRoles().get().getRole().forEach(role -> {
            role.getPermission().forEach(permission -> {
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

    public void grantAccessByAccessType(String formCode, Class clz, String accessType){
        HashMap<String, Boolean> accessWrite = new HashMap<>();
        accessType = accessType.toLowerCase();
        userService.getUserWithRoles().get().getRole().forEach(role -> {
            role.getPermission().forEach(permission -> {
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
        if(accessWrite.isEmpty() || !accessWrite.get(accessType)){
            throw new AccessDeniedException(clz, "formCode",formCode+", "+accessType+" = "+ accessWrite.get(accessType));
        }
    }
}
