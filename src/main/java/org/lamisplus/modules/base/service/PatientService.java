package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PatientService {

    private static final String PATIENT_REGISTRATION_FORM_CODE = "bbc01821-ff3b-463d-842b-b90eab4bdacd";
    private static final int STATUS = 0;
    private static final String INTAKE_FORM_CODE = "3746bd2c-362d-4944-8982-5189441b1d59";
    private final EncounterRepository encounterRepository;
    private final PatientTransformer patientTransformer;
    private final PatientRepository patientRepository;
    private final VisitRepository visitRepository;
    private final PatientMapper patientMapper;
    private final EncounterMapper encounterMapper;
    private final VisitMapper visitMapper;
    private final FormMapper formMapper;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final ProgramRepository programRepository;
    private final FormRepository formRepository;
    private final FormFlagRepository formFlagRepository;
    private final OrganisationUnitRepository organisationUnitRepository;
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final UserMapper userMapper;
    private final AccessRight accessRight;
    public static final String FORM_CODE = "formCode";
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private static final String READ = "read";
    /*private static final String WRITE = "write";
    private static final String DELETE = "delete";*/
    private final ObjectMapper mapper;
    private final FlagService flagService;

    public Patient save(PatientDTO patientDTO) {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        patientDTO = patientTransformer.checkForPatientNumber(patientDTO);
        Optional<Patient> patient1 = patientRepository.findByHospitalNumberAndPatientNumberTypeAndOrganisationUnitIdAndArchived(
                patientDTO.getHospitalNumber(), patientDTO.getPatientNumberType(), organisationUnitId, UN_ARCHIVED);
        if (patient1.isPresent())
            throw new RecordExistException(Patient.class, "Hospital Number", patientDTO.getHospitalNumber() + "");

        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setUuid(UUID.randomUUID().toString());
        patient.setOrganisationUnitId(organisationUnitId);
        Patient savedPatient = patientRepository.save(patient);

        //Start of flag operation for associated with (0)
        savePatientAndCheckForFlag(savedPatient.getId(), "bbc01821-ff3b-463d-842b-b90eab4bdacd", savedPatient.getDetails());

        return savedPatient;
    }

    public List<PatientDTO> getAllPatients() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        return getPatients(patientRepository.findAllByArchivedAndOrganisationUnitIdOrderByIdDesc(UN_ARCHIVED, organisationUnitId));
    }


    public List<PatientDTO> getAllPatients(Page<Patient> page) {
        List<Patient> patients = page.getContent();
        return getPatients(patients);
    }

    public PatientDTO getPatientByPatientNumberTypeHospitalNumber(String hospitalNumber, String patientNumberType) {
        Optional<Patient> patientOptional = this.patientRepository.findByHospitalNumberAndPatientNumberTypeAndOrganisationUnitIdAndArchived(hospitalNumber, patientNumberType, getOrganisationUnitId(), UN_ARCHIVED);

        if (!patientOptional.isPresent()) {
            throw new EntityNotFoundException(Patient.class, "Hospital Number & Patient Number Type", hospitalNumber + " & " + patientNumberType);
        }
        return updatePatientFlag(getPatient(patientOptional));
    }

    public PatientDTO getPatientByHospitalNumber(String hospitalNumber) {
        Optional<Patient> patientOptional = this.patientRepository.findByHospitalNumberAndOrganisationUnitIdAndArchived(hospitalNumber, getOrganisationUnitId(), UN_ARCHIVED);

        if (!patientOptional.isPresent()) {
            throw new EntityNotFoundException(Patient.class, "Hospital Number", hospitalNumber + "");
        }
        return this.updatePatientFlag(getPatient(patientOptional));
    }


    public Patient update(Long id, PatientDTO patientDTO) {
        patientRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() ->
                new EntityNotFoundException(Patient.class, "Id", id + ""));

        patientDTO = patientTransformer.checkForPatientNumber(patientDTO);
        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setId(id);
        Patient savedPatient = patientRepository.save(patient);

        //Start of flag operation for associated with (0)
        savePatientAndCheckForFlag(savedPatient.getId(), "bbc01821-ff3b-463d-842b-b90eab4bdacd", this.setAge(savedPatient.getDetails()));
        return savedPatient;

    }

    private void savePatientAndCheckForFlag(Long patientId, String formCode, Object details) {
        //Start of flag operation for associated with (0)
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived(formCode, 0, UN_ARCHIVED);
        Object patientDetails = this.setAge(details);
        if (!formFlags.isEmpty()) {
            flagService.checkForAndSavePatientFlag(patientId, patientDetails, formFlags);
        }
    }


    public List getEncountersByPatientIdAndDateEncounter(Long patientId, String formCode, Optional<String> dateStart, Optional<String> dateEnd) {
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();
        accessRight.grantAccessByAccessType(formCode, Patient.class, READ, permissions);
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        Specification<Encounter> specification = new GenericSpecification<Encounter>().findAllEncountersByPatientIdAndDateEncounter(patientId, formCode, dateStart, dateEnd, organisationUnitId);
        List<Encounter> encounters = encounterRepository.findAll(specification);

        return getFormData(encounters, null);
    }

    public List getAllEncountersByPatientId(Long patientId) {
        List<Encounter> encounters = getEncounterByPatientIdDesc(patientId);
        List<Object> formDataList = new ArrayList<>();
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

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
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccessByAccessType(formCode, Patient.class, READ, permissions);
        Pageable pageableSorter = createPageRequest(pageable, sortField, sortOrder, limit);
        List<Encounter> encountersList = this.encounterRepository.findAllByPatientIdAndFormCodeAndOrganisationUnitId(patientId, formCode, getOrganisationUnitId(), pageableSorter);
        return this.getFormData(encountersList, null);
    }

    public List getEncountersByPatientIdAndProgramCodeExclusionList(Long patientId, List<String> programCodeExclusionList) {
        List<Encounter> encounters = getEncounterByPatientIdDesc(patientId);
        List<EncounterDTO> encounterDTOS = new ArrayList<>();
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        if (programCodeExclusionList != null && programCodeExclusionList.size() > 0)
            programCodeExclusionList.forEach(programCode -> {

                //log.info("Exclusion list is" + programCode);
                encounters.forEach(singleEncounter -> {
                    if (!accessRight.grantAccessForm(singleEncounter.getFormCode(), permissions)) {
                        return;
                    }
                    if (singleEncounter.getProgramCode().equals(programCode)) return;
                    Patient patient = singleEncounter.getPatientByPatientId();
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
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(distinctEncounter -> {
            filledFormSet.add(distinctEncounter.getFormCode());
        });

        /*.size() > 0*/
        if (!filledFormSet.isEmpty()) {
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
                forms = flagService.setAndGetFormListForFlagOperation(this.getPatientById(patientId), form, forms);
            }

        } else {
            for (Form form : program.getFormsByProgram()) {
                if (form.getFormPrecedence() == null) {
                    //Start of flag operation
                    forms = flagService.setAndGetFormListForFlagOperation(this.getPatientById(patientId), form, forms);
                }
            }
        }
        return formMapper.FormToFormDTOs(forms);
    }


    public List<FormDTO> getFilledFormsByPatientIdAndProgramCode(Long patientId, String programCode) {
        List<Form> forms = new ArrayList<>();
        //Check for filled forms by the patient in that program
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(distinctEncounter -> {
            forms.add(formRepository.findByCodeAndArchived(distinctEncounter.getFormCode(), UN_ARCHIVED).get());
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
        encounterRepository.findDistinctProgramCodeAndOrganisationUnitIdAndArchived(programCode, getOrganisationUnitId(), UN_ARCHIVED).forEach(distinctEncounter -> {
            patientDTOList.add(getPatientByHospitalNumber(patientRepository.findById(distinctEncounter.getPatientId()).get().getHospitalNumber()));
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
            patientDTOs.add(patientTransformer.transformDTO(patientDTO));
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

    public Page<Patient> findAllPages(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber, Pageable pageable) {
        return patientRepository.findAllByFullDetails(firstName, lastName, hospitalNumber, mobilePhoneNumber, getOrganisationUnitId(), UN_ARCHIVED, pageable);
    }

    //Patients Not Managed
    public Page<Patient> findAllByPatientNotManagedByFilteredParameters(String programCode, String gender, String state, String lga,
                                                                        Boolean pregnant, Integer ageFrom, Integer ageTo, Pageable pageable) {
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        LocalDate nineMonths = currentMonth.minusMonths(9);
        List<String> genders = new ArrayList<>();
        List<String> states = new ArrayList<>();
        List<String> provinces = new ArrayList<>();
        List<Patient> patients;
        if (gender == null || gender.equalsIgnoreCase("*")) {
            if (pregnant) {
                genders.add("Female");
            } else {
                genders = applicationCodesetRepository.findAllGender();
            }
        } else {
            genders.add(gender);
        }

        if (state == null || state.equalsIgnoreCase("*")) {
            states = organisationUnitRepository.findAllState();
        } else {
            states.add(state);
        }

        if (lga == null || lga.equalsIgnoreCase("*")) {
            provinces = organisationUnitRepository.findAllProvince();
        } else {
            provinces.add(lga);
        }

        if (pregnant) {
            patients = patientRepository.findAllByPatientsNotManagedInHIVPregnantByFilteredParameters(genders, states, provinces,
                    getOrganisationUnitId(), ageFrom, ageTo, nineMonths, pageable)
                    .stream()
                    .collect(Collectors.toList());
        } else {
            patients = patientRepository.findAllByPatientsNotManagedInHIVNotPregnantByFilteredParameters(genders, states, provinces,
                    getOrganisationUnitId(), ageFrom, ageTo, nineMonths, pageable)
                    .stream()
                    .collect(Collectors.toList());
        }

        log.info("patients size {}", patients.size());
        //log.info("patientList size {}", patientList.size());
        Page page = new PageImpl<Patient>(patients, pageable, pageable.getPageSize());
        log.info("patients page size {}", page.getContent().size());
        return page;
    }


    //Patients Managed
    public Page<Patient> findAllByPatientManagedByFilteredParameters(String gender, String state, String lga,
                                                                     Integer ageTo, Integer ageFrom, Long applicationUserId, Pageable pageable) {


        List<Patient> patients;

        if (applicationUserId == null || applicationUserId == 0) {
            patients = patientRepository.findAllByPatientsManagedInHIVByFilteredParameters(getOrganisationUnitId(), ageFrom, ageTo, pageable)
                    .stream()
                    .collect(Collectors.toList());
        } else {
            patients = patientRepository.findAllByPatientsManagedInHIVByFilteredParametersByApplicationUserId(getOrganisationUnitId(), ageFrom, ageTo, applicationUserId, pageable)
                    .stream()
                    .collect(Collectors.toList());
        }
        log.info("patients size {}", patients.size());
        return new PageImpl<Patient>(patients, pageable, pageable.getPageSize());
    }

    private Boolean checkFilterParameters(String patientDetails, String gender, String state, String lga) {
        JsonNode tree = null;
        JsonNode jsonNode;
        Boolean find = false;
        log.info("In checkFilterParameters......");

        try {
            tree = mapper.readTree(patientDetails).get("gender");
            jsonNode = tree.get("display");
            String gen = String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");

            tree = mapper.readTree(patientDetails).get("province");
            jsonNode = tree.get("name");
            String localGovt = String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");

            tree = mapper.readTree(patientDetails).get("state");
            jsonNode = tree.get("name");
            String st = String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");

            if (gender != "*" && gender.equalsIgnoreCase(gen)) {
                find = true;
            } else if (gender == "*") {
                find = true;
            }
            if (localGovt != "*" && localGovt.equalsIgnoreCase(lga)) {
                find = true;
            } else if (localGovt == "*") {
                find = true;
            }
            if (st != "*" && st.equalsIgnoreCase(lga)) {
                find = true;
            } else if (st == "*") {
                find = true;
            }
            return find;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return false;
    }

    //Case management
    public UserDTO getUserByPatientId(Long id) {
        patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Patient.class, "id", "" + id));
        ApplicationUserPatient applicationUserPatient = applicationUserPatientRepository.findAllByPatientIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserPatient.class, "id:", id + ""));

        return userMapper.userToUserDTO(applicationUserPatient.getApplicationUserByApplicationUserId());
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

    private PatientDTO getPatientById(Long patientId) {
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

    private PatientDTO getPatient(Optional<Patient> patientOptional) {
        List<Flag> flags = new ArrayList<>();

        patientOptional.get().getPatientFlagsById().forEach(patientFlag -> {
            flags.add(patientFlag.getFlag());
        });
        Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patientOptional.get().getId());

        //Check for currently check-in patient
        PatientDTO patientDTO = visitOptional.isPresent() ? patientMapper.toPatientDTO(visitOptional.get(), patientOptional.get()) : patientMapper.toPatientDTO(patientOptional.get());
        patientDTO.setFlags(flags);
        return patientTransformer.transformDTO(patientDTO);
    }

    private Object setAge(Object object) {
        try {
            //mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            String details = "";
            if (object instanceof String) {
                details = object.toString();
            } else {
                details = mapper.writeValueAsString(object);
            }
            JSONObject patientDetails = new JSONObject(details);
            String dob = patientDetails.optString("dob");
            if (dob != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                //convert String to LocalDate
                LocalDate localDate = LocalDate.parse(dob, formatter);
                Period period = Period.between(localDate, LocalDate.now());
                patientDetails.remove("age");
                patientDetails.put("age", period.getYears());
            }
            return patientDetails;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    //Temp method to update Patient Flag
    private PatientDTO updatePatientFlag(PatientDTO patientDTO) {
        //Start of flag operation for associated with (0)
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived(PATIENT_REGISTRATION_FORM_CODE, STATUS, UN_ARCHIVED);
        if (!formFlags.isEmpty()) {
            String details = JsonUtil.getJsonNode(patientDTO.getDetails()).toString();
            flagService.checkForAndSavePatientFlag(patientDTO.getPatientId(), setAge(details), formFlags);
        }

        Optional<Encounter> optionalEncounter = encounterRepository.findOneByPatientIdAndFormCodeAndArchived(patientDTO.getPatientId(), INTAKE_FORM_CODE, UN_ARCHIVED);
        if (optionalEncounter.isPresent()) {
            Encounter encounter = optionalEncounter.get();
            Optional<FormData> optionalFormData = encounter.getFormDataByEncounter().stream().findFirst();
            if (optionalFormData.isPresent()) {
                formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived("INTAKE_FORM_CODE", STATUS, UN_ARCHIVED);
                if (!formFlags.isEmpty()) {
                    String formData = JsonUtil.getJsonNode(optionalFormData.get().getData()).toString();
                    flagService.checkForAndSavePatientFlag(patientDTO.getPatientId(), formData, formFlags);
                }
            }
        }
        return patientDTO;
    }

    public String getPatientIdentifierNumber(Long id, String identifierCode) {
        patientRepository.findByIdAndOrganisationUnitIdAndArchived
                (id, getOrganisationUnitId(), UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Patient.class, "id", id + ""));
        return patientRepository.findPatientIdentifierNumberByPatientId(id, identifierCode, UN_ARCHIVED, getOrganisationUnitId())
                .orElse(null);
    }

    public String getFormFieldValue(Long id, String formCode, String fieldName, Boolean isAppCodeSet) {
        patientRepository.findByIdAndOrganisationUnitIdAndArchived
                (id, getOrganisationUnitId(), UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Patient.class, "id", id + ""));

        Optional<Encounter> optionalEncounter = encounterRepository.findTopByPatientIdAndFormCodeAndOrganisationUnitIdOrderByIdDesc(id, formCode, getOrganisationUnitId());

        if (optionalEncounter.isPresent()) {
            Encounter encounter = optionalEncounter.get();
            int size = encounter.getFormDataByEncounter().size();
            FormData formData = encounter.getFormDataByEncounter().get(size - 1);
            Object data = formData.getData();
            String object = JsonUtil.getJsonNode(data).toString();
            JsonNode jsonNode = null;

            try {
                if (isAppCodeSet) {
                    jsonNode = mapper.readTree(object).get(fieldName);
                    jsonNode = jsonNode.get("display");
                    return String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");
                } else {
                    jsonNode = mapper.readTree(object.toString()).get(fieldName);
                    return String.valueOf(jsonNode).replaceAll("^\"+|\"+$", "");
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}


        //Patients Not Managed
    /*public Page<Patient> findAllByPatientNotManaged(String programCode, String gender, String state, String lga,
                                                    Boolean pregnant, Long applicationUserId, int age, Pageable pageable) {
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        LocalDate nineMonths = currentMonth.minusMonths(9);
        if(pregnant) {
            return patientRepository.findAllByPatientsNotManagedInHIVPregnantByFilteredParameters(gender, state, lga,
                    age, nineMonths, UN_ARCHIVED, getOrganisationUnitId(), 1, pageable);
        }
        return patientRepository.findAllByPatientsNotManagedInHIVNotPregnantByFilteredParameters(gender, state, lga,
                age, nineMonths, UN_ARCHIVED, getOrganisationUnitId(), 1, pageable);
    }*/

   /* //Patients Managed
    public Page<Patient> findAllByPatientManaged(String programCode, Pageable pageable) {
        if(programCode.equalsIgnoreCase("0d31f6ee-571c-45b8-80d5-3f7e1d5377b7")){
            return patientRepository.findAllByPatientsManagedInHIV(programCode, UN_ARCHIVED, getOrganisationUnitId(), 1, pageable);
        }
        return patientRepository.findAllByPatientsManaged(programCode, UN_ARCHIVED, getOrganisationUnitId(), pageable);
    }*/
