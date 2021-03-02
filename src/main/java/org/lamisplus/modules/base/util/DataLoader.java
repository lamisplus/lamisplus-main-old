package org.lamisplus.modules.base.util;

import java.io.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.List;

@Component
public class DataLoader<T> {
    private Boolean hasProgram;
    private Boolean hasForm;

    private static String getJsonFile(String fileName) {
        return "src/main/resources/test/"+fileName;
    }

    public static Path getJsonFile(Path jsonFilePath) {
        //TODO: throw exception is json file not found
        return jsonFilePath;
    }


    public List<T> readJsonFile(Object obj, String jsonFile){
        ObjectMapper objectMapper = new ObjectMapper();
        List<T> entityObject = null;
        InputStream input;

        try {
            input = new FileInputStream(jsonFile);

            CollectionType javaType = objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, obj.getClass());

            entityObject = objectMapper.readValue(input, javaType);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return entityObject;
    }

    public Boolean loadProgram(String jsonFile){
        //TODO: implement the saving of programs associated with a module
        return false;
    }

    public Boolean loadData(String jsonFile){
        //TODO: implement the saving of forms associated with a service
        return false;
    }
}
