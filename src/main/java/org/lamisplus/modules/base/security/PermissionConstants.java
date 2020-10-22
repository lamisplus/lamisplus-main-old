package org.lamisplus.modules.base.security;

public class PermissionConstants {

    public PermissionConstants() {
    }
    // Add or modify permission names here
    //Note* Renaming permissions would mean that roles affected have to be re-assigned the permissions
    public static enum PermissionsEnum { READ, WRITE, DELETE, MODIFY
    };
}
