package org.lamisplus.modules.base.bootstrap;

import org.springframework.stereotype.Component;

import java.io.*;
import java.util.Set;

public class ClassLoaderTest extends ClassLoader {

    private String classPath;
    private static String name;

    private ClassLoaderTest(String classPath) {
        this.classPath = classPath;
    }

    /**
     * The logic of writing findClass method
     *
     * @param name
     * @return
     * @throws ClassNotFoundException
     */
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        // Get class file byte array of class
        byte[] classData = getClassData(name);
        if (classData == null) {
            throw new ClassNotFoundException();
        } else {
            // Generate class object
            return defineClass(name, classData, 0, classData.length);
        }
    }

    /**
     * Write logic to get class file and convert it to byte stream
     *
     * @param className
     * @return
     */
    private byte[] getClassData(String className) {
        // Read bytes of class file
        String path = classNameToPath(className);
        try {
            InputStream is = new FileInputStream(path);
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            byte[] buffer = new byte[2048];
            int num = 0;
            // Read bytecode of class file
            while ((num = is.read(buffer)) != -1) {
                stream.write(buffer, 0, num);
            }
            return stream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Full path to class file
     *
     * @param className
     * @return
     */
    private String classNameToPath(String className) {
        name = classPath + File.separatorChar
                + className.replace('.', File.separatorChar) + ".class";
        return classPath + File.separatorChar
                + className.replace('.', File.separatorChar) + ".class";
    }

    public static ClassLoader getMain(Set<String> classNames, String classPath2) {
        ClassLoaderTest loader = new ClassLoaderTest(classPath2);

        try {
            //Load the specified class file
            for (String className : classNames) {
                Class<?> object1 = loader.loadClass(className);
                System.out.println(object1.newInstance().toString());
                System.out.println("ClassNameToPath is - " + name);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return loader;
    }
}
