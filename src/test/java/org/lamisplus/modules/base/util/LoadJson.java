package org.lamisplus.modules.base.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;


@Component
public class LoadJson<T> {


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
}
