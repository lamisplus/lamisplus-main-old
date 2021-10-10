package org.lamisplus.modules.base.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.entity.Flag;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.FormFlag;
import org.lamisplus.modules.base.domain.entity.PatientFlag;
import org.lamisplus.modules.base.repository.FlagRepository;
import org.lamisplus.modules.base.repository.FormFlagRepository;
import org.lamisplus.modules.base.repository.PatientFlagRepository;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FlagUtil {
    private final PatientFlagRepository patientFlagRepository;
    private final FormFlagRepository formFlagRepository;
    private final FlagRepository flagRepository;
    private final ObjectMapper mapper;



    public void checkForAndSavePatientFlag(Long patientId, Object forJsonNode, List<FormFlag> formFlags, Boolean temp){
        formFlags.forEach(formFlag -> {
            int flagDataType = formFlag.getFlag().getDatatype();
            String fieldName = formFlag.getFlag().getFieldName().trim();
            String operator = formFlag.getFlag().getOperator().trim();
            Boolean continuous = formFlag.getFlag().getContinuous();
            String formFlagFieldValue = formFlag.getFlag().getFieldValue().replaceAll("\\s", "").trim();
            JsonNode tree;
            String field = "";
            Integer fieldIntegerValue = 0;
            Integer formFlagFieldIntegerValue = 0;
            OperatorType operatorType = OperatorType.from(operator);

            //if not application code set but is string
            if (flagDataType == 0) {
                try {
                    tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                    if (formFlagFieldValue.equalsIgnoreCase(field)) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
                //if application code set
            } else if (flagDataType == 1) {
                try {
                    tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    JsonNode jsonNode = tree.get("display");
                    field = String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");
                    if (formFlagFieldValue.equalsIgnoreCase(field)) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }// If integer
            else if(flagDataType == 2) {
                try {
                    tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    //removing extra quotes
                    field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                    fieldIntegerValue = Integer.valueOf(field);
                    formFlagFieldIntegerValue = Integer.valueOf(formFlagFieldValue);

                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }

                if (operator.equalsIgnoreCase("equal_to")) {
                    if (formFlagFieldValue.equalsIgnoreCase(field)) {
                        savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }else if(continuous){
                        patientFlagRepository.findByPatientIdAndFlagId(patientId, formFlag.getFlagId()).ifPresent(patientFlag -> {
                            patientFlagRepository.delete(patientFlag);
                        });
                    }
                }
             else if (operator.equalsIgnoreCase("greater_than")){
                if (fieldIntegerValue > formFlagFieldIntegerValue) {
                    savePatientFlag(patientId, formFlag.getFlagId(), temp);
                }else if(continuous){
                    patientFlagRepository.findByPatientIdAndFlagId(patientId, formFlag.getFlagId()).ifPresent(patientFlag -> {
                        patientFlagRepository.delete(patientFlag);
                    });
                }

            } else if (operator.equalsIgnoreCase("less_than")){
                if (fieldIntegerValue < formFlagFieldIntegerValue) {
                    savePatientFlag(patientId, formFlag.getFlagId(), temp);
                }else if(continuous){
                    findByPatientIdAndFlagIdAndDelete(patientId, formFlag.getFlagId());
                }
            } else
                if (operator.equalsIgnoreCase("greater_than_or_equal_to")){
                    try {
                        if (fieldIntegerValue >= formFlagFieldIntegerValue) {
                            savePatientFlag(patientId, formFlag.getFlagId(), temp);
                        }else if(continuous){
                            findByPatientIdAndFlagIdAndDelete(patientId, formFlag.getFlagId());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
            } else if (operator.equalsIgnoreCase("less_than_or_equal_to")) {
                    if (fieldIntegerValue <= formFlagFieldIntegerValue) {
                        savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }else if(continuous){
                        findByPatientIdAndFlagIdAndDelete(patientId, formFlag.getFlagId());
                    }
                }
            }
        });
    }

    //Flag operation
    public List<Form> setAndGetFormListForFlagOperation(PatientDTO patientDTO, Form form, List<Form> forms){
        String details = JsonUtil.getJsonNode(patientDTO.getDetails()).toString();

        //Get forms flags are applied to
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived(form.getCode(), 1, 0);
        List<Flag> patientFlags = new ArrayList<>();

        //check if formFlag is empty
        if(formFlags.isEmpty()){
            forms.add(form);
            return forms;
        } else {
            //check for patient flag
                formFlags.forEach(formFlag -> {
                    patientDTO.getFlags().forEach(flag -> {
                    if(formFlag.getFlagId() == flag.getId()){
                        //Temporary solution to age and recency testing
                        patientFlags.add(flag);
                        /*if(formFlag.getFormCode().equalsIgnoreCase("f70f12f8-7c0b-4fb3-8a5d-7f4a01f5fee1")) {
                            Integer age = this.getAge(details);
                            if(age > 15) {
                                forms.add(form);
                            }
                        }else {
                            forms.add(form);
                        }*/
                    }


                });
            });
                if(patientFlags.size() == formFlags.size()){
                    forms.add(form);
                    return forms;
                }
        }
        return forms;
    }

    private void savePatientFlag(Long patientId, Long flagId, Boolean temp){
        PatientFlag patientFlag = new PatientFlag();
        patientFlag.setFlagId(flagId);
        patientFlag.setPatientId(patientId);
        List<PatientFlag> patientFlags = patientFlagRepository.findAllByPatientId(patientId);
        Flag flag = flagRepository.findByIdAndArchived(flagId, 0).get();
        //Check for opposites or similarities in flag field name & delete
        patientFlags.forEach(patientFlag1 -> {
           if(patientFlag1.getFlag().getFieldName().equalsIgnoreCase(flag.getFieldName()) &&
                   !patientFlag1.getFlag().getFieldValue().equalsIgnoreCase(flag.getFieldValue())) {
                   patientFlagRepository.delete(patientFlag1);
                   return;
           }
        });
        if (!patientFlagRepository.findByPatientIdAndFlagId(patientId, flagId).isPresent()) {
            patientFlagRepository.save(patientFlag);
            return;
        }
    }

    Integer getAge(Object object){
        try {
            final JsonNode tree = mapper.readTree(object.toString()).get("dob");
            String dob = String.valueOf(tree).replaceAll("^\"+|\"+$", "");

            if (dob != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                //convert String to LocalDate
                LocalDate localDate = LocalDate.parse(dob, formatter);
                Period period = Period.between(localDate, LocalDate.now());
                return period.getYears();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    private void findByPatientIdAndFlagIdAndDelete(Long patientId, Long flagId){
        patientFlagRepository.findByPatientIdAndFlagId(patientId, flagId).ifPresent(patientFlag -> {
            patientFlagRepository.delete(patientFlag);
        });
    }
}
