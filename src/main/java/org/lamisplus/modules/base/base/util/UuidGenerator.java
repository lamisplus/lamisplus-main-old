package org.lamisplus.modules.base.base.util;

import java.util.UUID;

public class UuidGenerator {
    public static String getUuid(){
        UUID uuid = UUID.randomUUID();
        String randomUUIDString = uuid.toString();
        return randomUUIDString;
    }
}
