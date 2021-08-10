package org.lamisplus.modules.base.util;

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
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FlagUtil {
    private final PatientFlagRepository patientFlagRepository;
    private final FormFlagRepository formFlagRepository;
    private final FlagRepository flagRepository;


    public void checkForAndSavePatientFlag(Long patientId, Object forJsonNode, List<FormFlag> formFlags, Boolean temp){
        formFlags.forEach(formFlag -> {
            int flagDataType = formFlag.getFlag().getDatatype();
            String fieldName = formFlag.getFlag().getFieldName().trim();
            String operator = formFlag.getFlag().getOperator();
            Boolean continuous = formFlag.getFlag().getContinuous();
            String formFlagFieldValue = formFlag.getFlag().getFieldValue().replaceAll("\\s", "").trim();
            ObjectMapper mapper = new ObjectMapper();

            //if not application code set
            if (flagDataType == 0) {
                try {
                    final JsonNode tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    String field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                    if (formFlagFieldValue.equalsIgnoreCase(field)) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
                //if application code set
            } else if (flagDataType == 1) {
                try {
                    final JsonNode tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    JsonNode jsonNode = tree.get("display");
                    String field = String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");
                    if (formFlagFieldValue.equalsIgnoreCase(field)) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }// If integer
            else if(flagDataType == 2) {
                if (operator.equalsIgnoreCase("=")) {
                    try {
                        final JsonNode tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                        String field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                        if (formFlagFieldValue.equalsIgnoreCase(field)) {
                            this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } else if (operator.equalsIgnoreCase(">")){
                try {
                    final JsonNode tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    String field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                    Integer integerValue = Integer.valueOf(field);
                    Integer formFlagFieldIntegerValue = Integer.valueOf(formFlagFieldValue);
                    if (integerValue > formFlagFieldIntegerValue) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (operator.equalsIgnoreCase("<")){
                try {
                    final JsonNode tree = mapper.readTree(forJsonNode.toString()).get(fieldName);
                    String field = String.valueOf(tree).replaceAll("^\"+|\"+$", "");
                    Integer integerValue = Integer.valueOf(field);
                    Integer formFlagFieldIntegerValue = Integer.valueOf(formFlagFieldValue);
                    if (integerValue < formFlagFieldIntegerValue) {
                        this.savePatientFlag(patientId, formFlag.getFlagId(), temp);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

    }

    //Flag operation
    public List<Form> setAndGetFormListForFlagOperation(PatientDTO patientDTO, Form form, List<Form> forms){
        //Get forms flags are applied to
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived(form.getCode(), 1, 0);

        //check if formFlag is empty
        if(formFlags.isEmpty()){
            forms.add(form);
        } else {
            //check for patient flag
            patientDTO.getFlags().forEach(flag -> {
                formFlags.forEach(formFlag -> {
                    if(formFlag.getFlagId() == flag.getId()){
                        forms.add(form);
                    }
                });
            });
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
        }
    }
}
