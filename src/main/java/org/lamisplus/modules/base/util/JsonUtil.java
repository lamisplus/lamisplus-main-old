package org.lamisplus.modules.base.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Util class to do:
 * - MARSHALLING: convert string json or file into Object
 * @return an object
 *
 * - UNMARSHALLING: convert Object into string json
 * @return a string json
 *
 */
public class JsonUtil {

    //request by sonar
    private JsonUtil() {
    }

    public static final Logger logger = LoggerFactory.getLogger(JsonUtil.class);

    public static <T> T json2Object(String str, Class<T> clazz)
            throws   IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper.readValue(str, clazz);
    }

    public static <T> String object2Json(T obj) throws   IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper.writeValueAsString(obj);
    }

    public static <T> T jsonFile2Object(String fileName, Class<T> clazz)
            throws  IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        //Ignoring missing fields in model objects
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper.readValue(new File(concatenate(fileName)), clazz);
    }

    private static String concatenate(String fileName) {
        Path path = Paths.get("src","main", "resources", "test", fileName);
        return path.toString();
    }

    public static List readJsonFile(Object obj, String jsonFile){
        ObjectMapper objectMapper = new ObjectMapper();
        List entityObject = null;
        InputStream input;
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

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

    public static List<String> traverse(JsonNode root, List <String> jsonFieldNames, Boolean withValues){
        if(root.isObject()){
            Iterator<String> fieldNames = root.fieldNames();

            while(fieldNames.hasNext()) {
                String fieldName = fieldNames.next();
                jsonFieldNames.add(fieldName);
                JsonNode fieldValue = root.get(fieldName);
                traverse(fieldValue, jsonFieldNames, false);
            }
        } else if(root.isArray()){
            ArrayNode arrayNode = (ArrayNode) root;
            for(int i = 0; i < arrayNode.size(); i++) {
                JsonNode arrayElement = arrayNode.get(i);
                traverse(arrayElement, jsonFieldNames, false);
            }
        } else {
            if(withValues){
                jsonFieldNames.add(root.toString());
            }
            //get the json value
            // JsonNode root represents a single value field - do something with it.
        }
        return jsonFieldNames;
    }

    public static JsonNode getJsonNode(Object object){
        if(object != null){
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.convertValue(object, JsonNode.class);
        }else return null;
    }

    public static String traverse(JsonNode root, String field) {
        return root.get(field).toString();
    }
}