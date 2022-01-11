package org.lamisplus.modules.base.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
@Configuration
@Data
public class YmlFile {
    @Value("${spring.datasource.url}")
    public static String dbUrl;

    @Value("${spring.datasource.username}")
    public static String dbUser;

    @Value("${spring.datasource.password}")
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
        File ymlFile = new File(file);
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
