package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javafx.application.Application;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.mapper.*;
import org.lamisplus.modules.base.repository.*;

import org.lamisplus.modules.base.util.*;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PatientService {

    public static final String HOSPITAL_NUMBER = "hospitalNumber";
    private final EncounterRepository encounterRepository;
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final PatientRepository patientRepository;
    private final VisitRepository visitRepository;
    private final PatientMapper patientMapper;
    private final EncounterMapper encounterMapper;
    private final VisitMapper visitMapper;
    private final FormMapper formMapper;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final FlagService flagService;
    private final ProgramRepository programRepository;
    private final FormRepository formRepository;
    private final FormFlagRepository formFlagRepository;
    private final PatientFlagRepository patientFlagRepository;
    private final AccessRight accessRight;
    public static final String FORM_CODE = "formCode";
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private static final String READ = "read";
    private static final String WRITE = "write";
    private static final String DELETE = "delete";
    private final ObjectMapper mapper;
    private final FlagUtil flagUtil;

    public Patient save(PatientDTO patientDTO) {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        patientDTO = transformDTO(HOSPITAL_NUMBER, patientDTO);

        Optional<Patient> patient1 = patientRepository.findByHospitalNumberAndOrganisationUnitIdAndArchived(patientDTO.getHospitalNumber(), organisationUnitId, UN_ARCHIVED);
        if (patient1.isPresent())
            throw new RecordExistException(Patient.class, "Hospital Number", patientDTO.getHospitalNumber() + "");

        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setUuid(UUID.randomUUID().toString());
        patient.setOrganisationUnitId(organisationUnitId);


        Patient savedPatient =  patientRepository.save(patient);

        //Start of flag operation for associated with (0)
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived("bbc01821-ff3b-463d-842b-b90eab4bdacd", 0, UN_ARCHIVED);
        if(!formFlags.isEmpty()){
            final Object finalPatientDTO = patientDTO.getDetails();
            flagUtil.checkForAndSavePatientFlag(patientDTO.getPatientId(), patientDTO.getDetails(), formFlags, false);
        }
        return savedPatient;
    }

    public List<PatientDTO> getAllPatients() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        return getPatients(patientRepository.findAllByArchivedAndOrganisationUnitIdOrderByIdDesc(UN_ARCHIVED, organisationUnitId));
    }


    public List<PatientDTO> getAllPatients(Page page) {
        List<Patient> patients = page.getContent();
        return getPatients(patients);
    }

    public PatientDTO getPatientByHospitalNumber(String hospitalNumber) {
        Optional<Patient> patientOptional = this.patientRepository.findByHospitalNumberAndOrganisationUnitIdAndArchived(hospitalNumber, getOrganisationUnitId(), UN_ARCHIVED);

        if (!patientOptional.isPresent()) {
            throw new EntityNotFoundException(Patient.class, "Hospital Number", hospitalNumber + "");
        }

        return this.updatePatientFlag(getPatient(patientOptional));
    }

    //Temp method to update Patient Flag
    private PatientDTO updatePatientFlag(PatientDTO patientDTO) {
        //Start of flag operation for associated with (0)
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived("bbc01821-ff3b-463d-842b-b90eab4bdacd", 0, UN_ARCHIVED);
        if (!formFlags.isEmpty()) {
            final Object finalPatientDetails = patientDTO.getDetails();
            flagUtil.checkForAndSavePatientFlag(patientDTO.getPatientId(), finalPatientDetails, formFlags, true);
        }


        Optional<Encounter> optionalEncounter = encounterRepository.findOneByPatientIdAndFormCodeAndArchived(patientDTO.getPatientId(), "3746bd2c-362d-4944-8982-5189441b1d59", UN_ARCHIVED);
        if(optionalEncounter.isPresent()){
            Encounter encounter = optionalEncounter.get();
            Optional<FormData> optionalFormData = encounter.getFormDataByEncounter().stream().findFirst();
            if(optionalFormData.isPresent()){
                formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived("3746bd2c-362d-4944-8982-5189441b1d59", 0, UN_ARCHIVED);
                if (!formFlags.isEmpty()) {
                    final Object finalFormData = optionalFormData.get().getData();
                    flagUtil.checkForAndSavePatientFlag(patientDTO.getPatientId(), finalFormData, formFlags, true);
                }
            }
        }
        return patientDTO;
    }

    public Patient update(Long id, PatientDTO patientDTO) {
        patientRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() ->
                new EntityNotFoundException(Patient.class, "Id", id + ""));

        patientDTO = transformDTO(HOSPITAL_NUMBER, patientDTO);

        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setId(id);
        return patientRepository.save(patient);
    }


    public List getEncountersByPatientIdAndDateEncounter(Long patientId, String formCode, Optional<String> dateStart, Optional<String> dateEnd) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formCode, Patient.class, READ, permissions);
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        Specification<Encounter> specification = new GenericSpecification<Encounter>().findAllEncountersByPatientIdAndDateEncounter(patientId, formCode, dateStart, dateEnd, organisationUnitId);

        List<Encounter> encounters = encounterRepository.findAll(specification);

        return getFormData(encounters, null);
    }

    public List getAllEncountersByPatientId(Long patientId) {
        List<Encounter> encounters = getEncounterByPatientIdDesc(patientId);
        List<Object> formDataList = new ArrayList<>();
        Set<String> permissions = accessRight.getAllPermission();

        encounters.forEach(encounter -> {
            if (!accessRight.grantAccessForm(encounter.getFormCode(), permissions)) {
                return;
            }
            encounter.getFormDataByEncounter().forEach(formData1 -> {
                formDataList.add(formData1.getData());
            });
        });
        return formDataList;
    }

    public List getEncountersByPatientIdAndFormCode(Pageable pageable, Long patientId, String formCode, String sortField, String sortOrder, Integer limit) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formCode, Patient.class, READ, permissions);
        Pageable pageableSorter = createPageRequest(pageable, sortField, sortOrder, limit);
        List<Encounter> encountersList = this.encounterRepository.findAllByPatientIdAndFormCodeAndOrganisationUnitId(patientId, formCode, getOrganisationUnitId(), pageableSorter);
        return this.getFormData(encountersList, null);
    }

    public List getEncountersByPatientIdAndProgramCodeExclusionList(Long patientId, List<String> programCodeExclusionList) {
        List<Encounter> encounters = getEncounterByPatientIdDesc(patientId);
        List<EncounterDTO> encounterDTOS = new ArrayList<>();
        Set<String> permissions = accessRight.getAllPermission();


        if (programCodeExclusionList != null && programCodeExclusionList.size() > 0)
            programCodeExclusionList.forEach(programCode -> {

                //log.info("Exclusion list is" + programCode);
                encounters.forEach(singleEncounter -> {
                    if (!accessRight.grantAccessForm(singleEncounter.getFormCode(), permissions)) {
                        return;
                    }
                    if (singleEncounter.getProgramCode().equals(programCode)) return;
                    Patient patient = singleEncounter.getPatientByPatientId();
                    //Person person = patient.getPersonByPersonId();
                    Form form = singleEncounter.getFormForEncounterByFormCode();

                    final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(patient, singleEncounter, form);
                    encounterDTOS.add(encounterDTO);
                });
            });
        return encounterDTOS;
    }

    /**
     * Archiving all patient details
     *
     * @param id
     * @return integer to confirm archive
     */
    public Integer delete(Long id) {
        //String username = userService.getUserWithRoles().get().getUserName();
        Optional<Patient> patientOptional = this.patientRepository.findByIdAndArchivedAndOrganisationUnitId(id, UN_ARCHIVED, getOrganisationUnitId());
        if (!patientOptional.isPresent()) throw new EntityNotFoundException(Patient.class, "Id", id + "");
        //setting all patient archive to 1
        Patient patient = patientOptional.get();
        patient.setArchived(ARCHIVED);
        //For encounter
        List<Encounter> encounters = new ArrayList<>();
        patientOptional.get().getEncountersByPatient().forEach(encounter -> {
            encounter.setArchived(ARCHIVED);
            encounters.add(encounter);
        });
        //For visit
        List<Visit> visits = new ArrayList<>();
        patientOptional.get().getVisitsByPatient().forEach(visit -> {
            visit.setArchived(ARCHIVED);
            visits.add(visit);
        });
        patientRepository.save(patient);
        //personRepository.save(person);
        encounterRepository.saveAll(encounters);
        visitRepository.saveAll(visits);

        return ARCHIVED;
    }

    public List<VisitDTO> getVisitByPatientIdAndVisitDate(Optional<Long> patientId, Optional<String> dateStart, Optional<String> dateEnd) {
        List<VisitDTO> visitDTOS = new ArrayList<>();

        Specification<Visit> specification = new GenericSpecification<Visit>().findAllVisitByPatientIdAndVisitDate(patientId, dateStart, dateEnd);

        List<Visit> visitList = visitRepository.findAll(specification);

        visitList.forEach(visit -> {
            Patient patient = visit.getPatientByVisit();
            List<AppointmentDTO> appointmentDTOS = appointmentService.getOpenAllAppointmentByPatientId(patient.getId());
            final VisitDTO visitDTO = visitMapper.toVisitDTO(visit, patient);
            visitDTO.setAppointmentDTOList(appointmentDTOS);
            visitDTOS.add(visitDTO);
        });

        return visitDTOS;
    }

    public Boolean exist(String patientNumber) {
        return patientRepository.existsByHospitalNumber(patientNumber);
    }

    public List<FormDTO> getAllFormsByPatientIdAndProgramCode(Long patientId, String programCode) {
        Optional<Program> optionalProgram = programRepository.findProgramByCodeAndArchived(programCode, UN_ARCHIVED);
        if (!optionalProgram.isPresent()) {
            throw new EntityNotFoundException(Program.class, "programCode", programCode + "");
        }
        Program program = optionalProgram.get();
        List<Form> forms = new ArrayList<>();
        HashSet<String> filledFormSet = new HashSet<>();
        HashSet<String> formCodeSet = new HashSet<>();

        //Check for filled forms by the patient in that program
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(encounterDistinctDTO -> {
            filledFormSet.add(encounterDistinctDTO.getFormCode());
        });

        if (filledFormSet.size() > 0) {
            program.getFormsByProgram().forEach(form -> {
                //if form has been filled, then return
                if (filledFormSet.contains(form.getCode())) {
                    // filledFormSet.add(form.getCode());
                    formCodeSet.add(form.getCode());
                    return;
                }
                //form not filled
                //Check for formPrecedence
                if (form.getFormPrecedence() == null) {
                    //form doesnt have precedence, so return form
                    formCodeSet.add(form.getCode());
                    return;
                }

                Set<String> formPrecedence = getFormPrecedence(form);
                //if all formPrecedence have been filled, return form.
                if (filledFormSet.containsAll(formPrecedence)) {
                    formCodeSet.add(form.getCode());
                    return;
                }
            });

            for (String formCode : formCodeSet) {
                Form form = formRepository.findByCodeAndArchived(formCode, UN_ARCHIVED).get();
                //Start of flag operation
                forms = flagUtil.setAndGetFormListForFlagOperation(this.getPatientById(patientId), form, forms);
            }

        } else {
            for (Form form : program.getFormsByProgram()) {
                if (form.getFormPrecedence() == null) {
                    //Start of flag operation
                    forms = flagUtil.setAndGetFormListForFlagOperation(this.getPatientById(patientId), form, forms);
                }
            }
        }
        return formMapper.FormToFormDTOs(forms);
    }




    public List<FormDTO> getFilledFormsByPatientIdAndProgramCode(Long patientId, String programCode) {
        List<Form> forms = new ArrayList<>();
        //Check for filled forms by the patient in that program
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(encounterDistinctDTO -> {
            forms.add(formRepository.findByCodeAndArchived(encounterDistinctDTO.getFormCode(), UN_ARCHIVED).get());
        });
        return formMapper.FormToFormDTOs(forms);
    }

    public List getAllProgramEnrolled(Long id) {
        return null;
    }

    public Long getTotalCount() {
        return patientRepository.countByOrganisationUnitIdAndArchived(getOrganisationUnitId(), UN_ARCHIVED);
    }

    public List<PatientDTO> getAllPatientsByProgramCode(String programCode) {
        List<PatientDTO> patientDTOList = new ArrayList<>();
        encounterRepository.findDistinctProgramCodeAndOrganisationUnitIdAndArchived(programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(encounterDistinctDTO -> {
            patientDTOList.add(getPatientByHospitalNumber(patientRepository.findById(encounterDistinctDTO.getPatientId()).get().getHospitalNumber()));
        });
        return patientDTOList;
    }


    public List<PatientDTO> getPatients(List<Patient> patients) {
        List<PatientDTO> patientDTOs = new ArrayList<>();
        List<Flag> flags = new ArrayList<>();

        patients.forEach(patient -> {
            patient.getPatientFlagsById().forEach(patientFlag -> {
                flags.add(patientFlag.getFlag());
            });

            Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patient.getId());
            PatientDTO patientDTO = visitOptional.isPresent() ? patientMapper.toPatientDTO(visitOptional.get(), patient) : patientMapper.toPatientDTO(patient);
            patientDTO.setFlags(flags);
            patientDTOs.add(transformDTO(patientDTO));
        });

        return patientDTOs;
    }

    public Page<Patient> findPage(Pageable pageable) {
        return patientRepository.findAllByOrganisationUnitIdAndArchivedOrderByIdDesc(getOrganisationUnitId(), UN_ARCHIVED, pageable);
    }

    public Page<Patient> findPage(String key, String value, Pageable pageable) {
        return patientRepository.findAllByDetails(key, value, getOrganisationUnitId(), UN_ARCHIVED, pageable);
    }

    public Page<Patient> findPage(String firstName, String lastName, String hospitalNumber, Pageable pageable) {
        return patientRepository.findAllByDetails(firstName, lastName, hospitalNumber, getOrganisationUnitId(), UN_ARCHIVED, pageable);
    }

    public Page<Patient> findAllPages(String firstName, String lastName, String hospitalNumber, Pageable pageable) {
        return patientRepository.findAllByFullDetails(firstName, lastName, hospitalNumber, getOrganisationUnitId(), UN_ARCHIVED, pageable);
    }

    private PatientDTO transformDTO(PatientDTO patientDTO) {
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

    private PatientDTO transformDTO(String key, PatientDTO patientDTO){
        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            String formDataJsonString = mapper.writeValueAsString(patientDTO.getDetails());

            JSONObject patientDetails = new JSONObject(formDataJsonString);
            mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            if(patientDetails.optJSONObject("otherIdentifier") != null) {
                JSONArray otherIdentifier = new JSONArray(patientDetails.get("otherIdentifier").toString());


                if (otherIdentifier != null && patientDTO.getHospitalNumber().equals("")) {
                    if (!mapper.readValue(otherIdentifier.toString(), List.class).isEmpty()) {
                        String time = String.valueOf(Timestamp.from(Instant.now())).replace("-", "")
                                .replace(" ", "")
                                .replace(":", "")
                                .replace(".", "");
                        patientDetails.put("hospitalNumber", RandomCodeGenerator.randomAlphabeticString(4) + time);
                    }
                }
            }

            if (patientDetails.has(key)) {
                patientDTO.setHospitalNumber(patientDetails.get(key).toString());
                patientDTO.setDetails(patientDetails.toString());
            } else {
                throw new EntityNotFoundException(Patient.class, "Hospital Number", "null");
            }
        } catch (JSONException | JsonProcessingException  | NullPointerException e) {
            e.printStackTrace();
        }
        return patientDTO;
    }

    private Set<String> getFormPrecedence(Form form) {
        JSONArray jsonArray = new JSONArray();
        HashSet<String> formPrecedenceSet = new HashSet<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            String formPrecedenceJson = mapper.writeValueAsString(form.getFormPrecedence());
            JSONObject jsonObject = new JSONObject(formPrecedenceJson);

            if (jsonObject.has(FORM_CODE)) {
                jsonArray = jsonObject.getJSONArray(FORM_CODE);
            }
            if (jsonArray.length() > 0) {
                for (int i = 0; i < jsonArray.length(); i++) {
                    formPrecedenceSet.add(jsonArray.getString(i));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return formPrecedenceSet;
    }

    private Long getOrganisationUnitId() {
        return userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
    }

    private PatientDTO getPatientById(Long patientId){
        Optional<Patient> patientOptional = this.patientRepository.findByIdAndOrganisationUnitIdAndArchived(patientId, getOrganisationUnitId(), UN_ARCHIVED);

        if (!patientOptional.isPresent()) {
            throw new EntityNotFoundException(Patient.class, "Id", patientId + "");
        }

        return this.getPatient(patientOptional);
    }

    /**
     * Get a list of Encounter By PatientId in Desc order
     *
     * @param patientId
     * @return Encounter List
     */
    private List<Encounter> getEncounterByPatientIdDesc(Long patientId) {
        Specification<Encounter> specification = new GenericSpecification<Encounter>().findAllEncounterByPatientIdDesc(patientId, getOrganisationUnitId());

        return encounterRepository.findAll(specification);
    }

    /**
     * Get a list of formData
     *
     * @param page page
     * @return FormData List
     */
    private List getFormData(List<Encounter> encounterList, Page page) {
        List<Map> formDataList = new ArrayList();
        List<Encounter> encounters = new ArrayList();
        if (page == null) {
            encounters = encounterList;
        } else {
            encounters = page.getContent();
        }
        //First forEach loop
        encounters.forEach(encounter -> {
            //Check if encounter is archived
            if (encounter.getArchived() == 1) return;
            //Second forEach loop for getting formData
            encounter.getFormDataByEncounter().forEach(formData -> {
                try {
                    //Instance of ObjectMapper provides functionality for reading and writing JSON
                    ObjectMapper mapper = new ObjectMapper();
                    String formDataJsonString = mapper.writeValueAsString(formData.getData());

                    JSONObject main = new JSONObject(formDataJsonString);
                    main.put("encounterId", formData.getEncounterId());
                    main.put("formDataId", formData.getId());

                    Map<String, String> map = mapper.readValue(main.toString(), Map.class);

                    formDataList.add(map);
                } catch (JSONException | JsonProcessingException e) {
                    e.printStackTrace();
                }
            });
        });
        return formDataList;
    }

    private Pageable createPageRequest(Pageable pageable, String sortField, String sortOrder, Integer limit) {
        Sort sort;
        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        if (limit != null && limit > 0) {
            pageSize = limit;
        }

        if (sortField == null || sortField.isEmpty()) {
            sortField = "dateEncounter";
            sort = Sort.by(sortField).descending();
        } else {
            sort = Sort.by(sortField).descending();
        }

        if (sortOrder != null && sortOrder.equalsIgnoreCase("Asc")) {
            sort = Sort.by(sortField).ascending();
        }

        return PageRequest.of(pageNumber, pageSize, sort);
    }

    private PatientDTO getPatient(Optional<Patient> patientOptional){
        List<Flag> flags = new ArrayList<>();

        patientOptional.get().getPatientFlagsById().forEach(patientFlag -> {
            flags.add(patientFlag.getFlag());
        });
        Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patientOptional.get().getId());

        //Check for currently check-in patient
        PatientDTO patientDTO = visitOptional.isPresent() ? patientMapper.toPatientDTO(visitOptional.get(), patientOptional.get()) : patientMapper.toPatientDTO(patientOptional.get());
        patientDTO.setFlags(flags);
        return transformDTO(patientDTO);
    }
}