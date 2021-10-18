package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientTransformer {
    private final ObjectMapper mapper;
    private static final String HOSPITAL_NUMBER = "Hospital Number";

    public PatientDTO transformDTO(PatientDTO patientDTO) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            if (patientDTO.getDetails().toString() != null) {
                mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                String patientDetailsString = mapper.writeValueAsString(patientDTO.getDetails());
                JSONObject patientJson = new JSONObject(patientDetailsString);
                if (patientJson.get("firstName").toString() != null) patientDTO.setFirstName(patientJson.get("firstName").toString());
                if (patientJson.get("lastName").toString() != null) patientDTO.setLastName(patientJson.get("lastName").toString());
                if (patientJson.get("gender")!= null && !patientJson.get("gender").toString().isEmpty()) {
                    JSONObject genderJson = new JSONObject(patientJson.get("gender").toString());
                    patientDTO.setGenderId(Long.valueOf(genderJson.get("id").toString()));
                }
                if (patientJson.get("otherNames").toString() != null) patientDTO.setOtherNames(patientJson.get("otherNames").toString());
                if (patientJson.get("dob").toString() != null) patientDTO.setDob(LocalDate.parse(patientJson.get("dob").toString(), formatter));
                if (patientJson.get("dobEstimated").toString() != null) patientDTO.setDobEstimated(Boolean.valueOf(patientJson.get("dobEstimated").toString()));
                if (patientJson.get("mobilePhoneNumber").toString() != null) patientDTO.setMobilePhoneNumber(patientJson.get("mobilePhoneNumber").toString());
                if (patientJson.get("alternatePhoneNumber").toString() != null) patientDTO.setAlternatePhoneNumber(patientJson.get("alternatePhoneNumber").toString());
                if (patientJson.get("street").toString() != null) patientDTO.setStreet(patientJson.get("street").toString());
                if (patientJson.get("landmark").toString() != null) patientDTO.setLandmark(patientJson.get("landmark").toString());
                if (patientJson.optJSONObject("education")!= null && !patientJson.get("education").toString().isEmpty()) {
                    JSONObject educationJson = new JSONObject(patientJson.get("education").toString());
                    patientDTO.setEducationId(Long.valueOf(educationJson.get("id").toString()));
                }
                if (patientJson.optJSONObject("occupation") != null && !patientJson.get("occupation").toString().isEmpty()) {
                    JSONObject occupationJson = new JSONObject(patientJson.get("occupation").toString());
                    patientDTO.setOccupationId(Long.valueOf(occupationJson.get("id").toString()));
                }
                if (patientJson.optJSONObject("country") != null) {
                    JSONObject countryJson = new JSONObject(patientJson.get("country").toString());
                    patientDTO.setCountryId(Long.valueOf(countryJson.get("id").toString()));
                }
                if (patientJson.optJSONObject("maritalStatus") != null && !patientJson.get("maritalStatus").toString().isEmpty()) {
                    JSONObject maritalStatusJson = new JSONObject(patientJson.get("maritalStatus").toString());
                    patientDTO.setMaritalStatusId(Long.valueOf(maritalStatusJson.get("id").toString()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return patientDTO;
    }

    public PatientDTO checkForPatientNumber(PatientDTO patientDTO){
        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            String details = mapper.writeValueAsString(patientDTO.getDetails());
            JSONObject patientDetails = new JSONObject(details);
            mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            JsonNode jsonNode = mapper.convertValue(patientDTO, JsonNode.class);
            String hospitalNumber = String.valueOf(jsonNode.get("details").get("hospitalNumber")).replaceAll("^\"+|\"+$", "");

            if(!jsonNode.get("details").get("patientHasOtherIdentifiers").isNull() && jsonNode.get("details").get("patientHasOtherIdentifiers").asBoolean() == true
                    && StringUtils.isBlank(jsonNode.get("details").get("hospitalNumber").asText())) {

                ArrayNode arrayNode = (ArrayNode) jsonNode.get("details").get("otherIdentifier");
                Iterator<JsonNode> itr = arrayNode.elements();
                // and to get the string from one of the elements
                JsonNode node = itr.next();
                String identifier = String.valueOf(node.get("identifier")).replaceAll("^\"+|\"+$", "");
                String identifierType = String.valueOf(node.get("identifierType").get("display")).replaceAll("^\"+|\"+$", "");
                patientDTO.setPatientNumberType(identifierType);
                patientDTO.setHospitalNumber(identifier);
                patientDetails.put("hospitalNumber", identifier);
                //If patient has hospital Number
            } else if(!StringUtils.isBlank(hospitalNumber)){
                patientDTO.setPatientNumberType(HOSPITAL_NUMBER);
                patientDTO.setHospitalNumber(hospitalNumber);
            } else {
                throw new EntityNotFoundException(Patient.class, "Hospital Number & Identifier", "null");
            }
        } catch (JSONException | JsonProcessingException | NullPointerException e) {
            e.printStackTrace();
        }
        return patientDTO;
    }
}
