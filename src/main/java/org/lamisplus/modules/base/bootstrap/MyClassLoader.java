package org.lamisplus.modules.base.bootstrap;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class MyClassLoader extends ClassLoader {

    @Override
    public Class<?> loadClass(String name) throws ClassNotFoundException {
        //if (name.equals("com.abc.bootbycustomloader.controller.UserController")) {
            // assump that UserController is the encrypted class
            // i need to load this encrypted class, and decrypted it!

            // load the class from a special place, mock the decrypted processing
            String path = "C:\\Users\\Dell\\Dropbox\\My PC (DESKTOP-IC75349)\\Desktop\\demo";
            byte[] data = new byte[2048];
            try {
                data = Files.readAllBytes(Paths.get(path));
            } catch (IOException e) {
                e.printStackTrace();
            }
            // mock decrypted processing success, return the decrypted class
            Class<?> clz = defineClass(name, data, 0, data.length);
            return clz;
        /*} else {
            // assump that other class is not encrypted class
            // just load it as usual
            return super.loadClass(name);
        }*/
    }
}
