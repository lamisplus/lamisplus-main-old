package org.lamisplus.modules.base.util;

import java.io.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataLoader<T> {
    private Boolean hasProgram;
    private Boolean hasForm;

    private static String getJsonFile(String fileName) {
        return "src/main/resources/test/"+fileName;
    }

    public List<T> readJsonFile(Object obj, String jsonFile){
        ObjectMapper objectMapper = new ObjectMapper();
        List<T> entityObject = null;
        InputStream input;

        try {
            input = new FileInputStream(getJsonFile(jsonFile));

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

     public Boolean loadForms(String jsonFile){
         //TODO: implement the saving of forms associated with a service
         return false;
     }

}
