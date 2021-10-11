package org.lamisplus.modules.base.bootstrap;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

public class ClassPathHacker {
    private static final Class[] parameters = new Class[]{URL.class};
    public static void addFile(String filePath) throws IOException {
        File file = new File(filePath);
        addFile(file);
    }

    public static void addFile(File file) throws IOException {
        addURL(file.toURI().toURL());
    }

    public static void addURL(URL url) throws IOException {
        URLClassLoader systemClassLoader = (URLClassLoader)ClassLoader.getSystemClassLoader();
        Class sysclass = URLClassLoader.class;
        try {
            Method method = sysclass.getDeclaredMethod("addURL",parameters);
            method.setAccessible(true);
            method.invoke(systemClassLoader,new Object[]{ url });
        } catch (Throwable t) {
            t.printStackTrace();
            throw new IOException("Error, could not add URL to system classloader");
        }
    }
}
