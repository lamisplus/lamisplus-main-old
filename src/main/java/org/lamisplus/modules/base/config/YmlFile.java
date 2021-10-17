package org.lamisplus.modules.base.config;

import lombok.Data;
import org.springframework.context.annotation.Configuration;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
@Configuration
@Data
public class YmlFile {
    public static String dbUrl;

    public static String dbUser;

    public static String dbPass;

    public static DatabaseProperties readYml(File ymlFile) throws IOException {
        BufferedReader in = null;
        DatabaseProperties databaseProperties;
        try {
            in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(ymlFile.getAbsolutePath())));
            Yaml yaml = new Yaml();
            databaseProperties = yaml.loadAs(in, DatabaseProperties.class);

            in.close();
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }finally {
            if (in != null) {in.close(); }
        }
        return databaseProperties;
    }

    public static void getDatabaseConnectionParameters(String file) {
        String fileSeparator = File.separator;
        File ymlFile = new File(ApplicationProperties.modulePath + fileSeparator + "config.yml");
        try {
            readYml(ymlFile).getSpring().forEach((k, v) -> {
                dbUrl = v.getUrl();
                dbUser = v.getUsername();
                dbPass = v.getPassword();
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}