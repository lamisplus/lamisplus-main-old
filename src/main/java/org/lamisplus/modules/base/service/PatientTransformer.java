package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientTransformer {
    private final ObjectMapper mapper = new ObjectMapper();

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
                if (patientJson.get("hospitalNumber").toString() != null) patientDTO.setHospitalNumber(patientJson.get("hospitalNumber").toString());
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

    public PatientDTO transformDTO(String key, PatientDTO patientDTO){
        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            String formDataJsonString = mapper.writeValueAsString(patientDTO.getDetails());

            JSONObject patientDetails = new JSONObject(formDataJsonString);
            mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            if(patientDetails.optJSONObject("otherIdentifier") != null) {
                JSONArray otherIdentifier = new JSONArray(patientDetails.get("otherIdentifier").toString());


                if (otherIdentifier != null && patientDTO.getHospitalNumber().equals("")) {
                    if (!mapper.readValue(otherIdentifier.toString(), List.class).isEmpty()) {
                        String identifier = otherIdentifier.getJSONObject(0).get("identifier").toString();
                        /*String time = String.valueOf(Timestamp.from(Instant.now())).replace("-", "")
                                .replace(" ", "")
                                .replace(":", "")
                                .replace(".", "");
                        patientDetails.put("hospitalNumber", RandomCodeGenerator.randomAlphabeticString(4) + time);*/
                    }
                }
            }

            if (patientDetails.has(key)) {
                patientDTO.setHospitalNumber(patientDetails.get(key).toString());
                patientDTO.setDetails(patientDetails.toString());
            } else {
                throw new EntityNotFoundException(Patient.class, "Hospital Number", "null");
            }
        } catch (JSONException | JsonProcessingException | NullPointerException e) {
            e.printStackTrace();
        }
        return patientDTO;
    }
}
