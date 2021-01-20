package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.mapper.*;
import org.lamisplus.modules.base.repository.*;

import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.lamisplus.modules.base.util.UuidGenerator;

import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PatientService {
    public static final int UNARCHIVED = 0;
    public static final int ARCHIVED = 1;
    private final EncounterRepository encounterRepository;
    private final PatientRepository patientRepository;
    private final PersonRepository personRepository;
    private final PersonContactRepository personContactRepository;
    private final PersonRelativeRepository personRelativeRepository;
    private final VisitRepository visitRepository;
    private final PatientMapper patientMapper;
    private final PersonRelativeMapper personRelativeMapper;
    private final EncounterMapper encounterMapper;
    private final VisitMapper visitMapper;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final ProgramRepository programRepository;
    private final Integer archived = 1;
    private final FormRepository formRepository;
    private final AccessRight accessRight;
    public static final String FORM_CODE = "formCode";
    //private Page page;


    public Person save(PatientDTO patientDTO) {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        Optional<Patient> patient1 = this.patientRepository.findByHospitalNumberAndOrganisationUnitId(patientDTO.getHospitalNumber(), organisationUnitId);
        if(patient1.isPresent())throw new RecordExistException(Patient.class, "Hospital Number", patientDTO.getHospitalNumber()+"");
        log.info("patientDTO from front end - "+ patientDTO);

        final Person person = patientMapper.toPerson(patientDTO);
        person.setUuid(UuidGenerator.getUuid());
        final Person createdPerson = this.personRepository.save(person);

        final PersonContact personContact = patientMapper.toPersonContact(patientDTO);
        personContact.setPersonId(createdPerson.getId());
        this.personContactRepository.save(personContact);

        if (patientDTO.getPersonRelativeDTOs()!= null || patientDTO.getPersonRelativeDTOs().size() > 0) {
            final List<PersonRelative> personRelatives = new ArrayList<>();
            patientDTO.getPersonRelativeDTOs().forEach(personRelativeDTO -> {
                final PersonRelative personRelative = personRelativeMapper.toPersonRelative(personRelativeDTO);
                personRelative.setPersonId(createdPerson.getId());
                personRelatives.add(personRelative);
                this.personRelativeRepository.save(personRelative);
            });
            this.personRelativeRepository.saveAll(personRelatives);
        }

        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setPersonByPersonId(createdPerson);
        patient.setPersonId(createdPerson.getId());
        patient.setUuid(UuidGenerator.getUuid());
        patient.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        patient.setOrganisationUnitId(organisationUnitId);
        this.patientRepository.save(patient);
        return person;
    }

    public List<PatientDTO> getAllPatients() {
        GenericSpecification<Patient> genericSpecification = new GenericSpecification<Patient>();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        Specification<Patient> specification = genericSpecification.findAllWithOrganisation(organisationUnitId);

        List<Patient> patients = patientRepository.findAll(specification);
        return getPatients(patients);
    }


    public List<PatientDTO> getAllPatients(Page page) {
/*
        GenericSpecification<Patient> genericSpecification = new GenericSpecification<Patient>();
        Specification<Patient> specification = genericSpecification.findAll(0);

        page = patientRepository.findAll(specification, pageable);
        //HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
*/

        List<Patient> patients = page.getContent();
        return getPatients(patients);
    }

    public PatientDTO getPatientByHospitalNumber(String hospitalNumber) {
        Optional<Patient> patientOptional = this.patientRepository.findByHospitalNumberAndOrganisationUnitId(hospitalNumber, getOrganisationUnitId());

        if(!patientOptional.isPresent() || patientOptional.get().getArchived()==1){
            throw new EntityNotFoundException(Patient.class, "Hospital Number", hospitalNumber+"");
        }

        Person person = patientOptional.get().getPersonByPersonId();
        PersonContact personContact = person.getPersonContactsByPerson();
        Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patientOptional.get().getId());

        //Check for currently check-in patient
        PatientDTO patientDTO = visitOptional.isPresent() ? patientMapper.toPatientDTO(person, visitOptional.get(), personContact, patientOptional.get()) : patientMapper.toPatientDTO(person, personContact, patientOptional.get());

        List<PersonRelativesDTO> personRelativeDTOs = new ArrayList<>();
        List<PersonRelative> personRelatives = person.getPersonRelativesByPerson();

        if (personRelatives.size() > 0) {
            personRelatives.forEach(personRelative -> {
                if(personRelative.getArchived() == archived)
                    return;

                PersonRelativesDTO personRelativesDTO = personRelativeMapper.toPersonRelativeDTO(personRelative);
                personRelativeDTOs.add(personRelativesDTO);
            });
            patientDTO.setPersonRelativeDTOs(personRelativeDTOs);
        }
        return patientDTO;
    }


    public Person update(Long id, PatientDTO patientDTO) {
        Optional<Patient> patientOptional = this.patientRepository.findById(id);
        if(!patientOptional.isPresent() || patientOptional.get().getArchived()==1)throw new EntityNotFoundException(Patient.class, "Id", id+"");

        final Person person = patientMapper.toPerson(patientDTO);
        person.setId(patientOptional.get().getPersonId());
        person.setUuid(patientOptional.get().getPersonByPersonId().getUuid());
        final Person updatedPerson = this.personRepository.save(person);

        final PersonContact personContact = patientMapper.toPersonContact(patientDTO);
        Optional<PersonContact> personContactOptional = this.personContactRepository.findByPersonId(updatedPerson.getId());
        personContact.setId(personContactOptional.get().getId());
        personContact.setPersonId(updatedPerson.getId());

        this.personContactRepository.save(personContact);

        final List<PersonRelative> personRelatives = new ArrayList<>();
        if(patientDTO.getPersonRelativeDTOs() != null && patientDTO.getPersonRelativeDTOs().size()>0) {
            patientDTO.getPersonRelativeDTOs().forEach(personRelativeDTO -> {
                Optional<PersonRelative> personRelativeOptional = this.personRelativeRepository.findById(personRelativeDTO.getId());
                final PersonRelative personRelative = personRelativeMapper.toPersonRelative(personRelativeDTO);

                //If person relative exist
                if(personRelativeOptional.isPresent()){
                    //Setting person relative id
                    personRelative.setId(personRelativeOptional.get().getId());
                }
                personRelative.setPersonId(updatedPerson.getId());
                personRelatives.add(personRelative);
            });

            this.personRelativeRepository.saveAll(personRelatives);
        }

        final Patient patient = patientMapper.toPatient(patientDTO);
        patient.setPersonId(updatedPerson.getId());
        patient.setId(id);
        patient.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        this.patientRepository.save(patient);

        return person;
    }


    public List getEncountersByPatientIdAndDateEncounter(Long patientId, String formCode, Optional<String> dateStart, Optional<String> dateEnd) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(formCode, Patient.class, "read", permissions);
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
                if(!accessRight.grantAccessForm(encounter.getFormCode(), permissions)){
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

        accessRight.grantAccessByAccessType(formCode, Patient.class, "read", permissions);
        Pageable pageableSorter = createPageRequest(pageable, sortField, sortOrder, limit);
        List<Encounter> encountersList = this.encounterRepository.findAllByPatientIdAndFormCodeAndOrganisationUnitId(patientId,formCode, getOrganisationUnitId(),pageableSorter);
        return this.getFormData(encountersList, null);
    }

    //Todo: revisit issue: java.lang.NullPointerException
    public List getEncountersByPatientIdAndProgramCodeExclusionList(Long patientId, List<String> programCodeExclusionList) {
        List<Encounter> encounters = getEncounterByPatientIdDesc(patientId);
        List<EncounterDTO> encounterDTOS = new ArrayList<>();
        Set<String> permissions = accessRight.getAllPermission();


        if (programCodeExclusionList != null && programCodeExclusionList.size() > 0)
                programCodeExclusionList.forEach(programCode -> {

                    //log.info("Exclusion list is" + programCode);
                    encounters.forEach(singleEncounter -> {
                        if(!accessRight.grantAccessForm(singleEncounter.getFormCode(), permissions)){
                            return;
                        }
                        if (singleEncounter.getProgramCode().equals(programCode)) return;
                        Patient patient = singleEncounter.getPatientByPatientId();
                        Person person = patient.getPersonByPersonId();
                        Form form = singleEncounter.getFormForEncounterByFormCode();

                        final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(person, patient, singleEncounter, form);
                        encounterDTOS.add(encounterDTO);
                    });
                });
        return encounterDTOS;
    }

    /**
     * Archiving all patient details
     * @param id
     * @return integer to confirm archive
     */
    public Integer delete(Long id) {
        String username = userService.getUserWithRoles().get().getUserName();
        Optional<Patient> patientOptional = this.patientRepository.findById(id);
        if(!patientOptional.isPresent() || patientOptional.get().getArchived()==1)throw new EntityNotFoundException(Patient.class, "Id", id+"");
        //setting all patient archive to 1
        patientOptional.get().setArchived(archived);
        patientOptional.get().setModifiedBy(username);
        //For person
        patientOptional.get().getPersonByPersonId().setArchived(1);
        patientOptional.get().getPersonByPersonId().setModifiedBy(username);
        //For encounter
        patientOptional.get().getEncountersByPatient().forEach(encounter -> {
            encounter.setArchived(ARCHIVED);
            encounter.setModifiedBy(username);
        });
        //For visit
        patientOptional.get().getVisitsByPatient().forEach(visit -> {
            visit.setArchived(1);
            visit.setModifiedBy(username);
        });
        return patientOptional.get().getArchived();
    }

    public List<VisitDTO> getVisitByPatientIdAndVisitDate(Optional <Long> patientId, Optional<String> dateStart, Optional<String> dateEnd) {
        List<VisitDTO> visitDTOS = new ArrayList<>();

        Specification<Visit> specification = new GenericSpecification<Visit>().findAllVisitByPatientIdAndVisitDate(patientId, dateStart, dateEnd);

        List<Visit> visitList = visitRepository.findAll(specification);

        visitList.forEach(visit -> {
            Patient patient = visit.getPatientByVisit();
            Person person = patient.getPersonByPersonId();
            List<AppointmentDTO> appointmentDTOS = appointmentService.getOpenAllAppointmentByPatientId(patient.getId());
            final VisitDTO visitDTO = visitMapper.toVisitDTO(visit, person);
            visitDTO.setAppointmentDTOList(appointmentDTOS);
            visitDTOS.add(visitDTO);
        });

        return visitDTOS;
    }

    public Boolean exist(String patientNumber){
        return patientRepository.existsByHospitalNumber(patientNumber);
    }

    private Pageable createPageRequest(Pageable pageable, String sortField, String sortOrder, Integer limit) {
        Sort sort;
        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        if(limit != null && limit > 0){
            pageSize = limit;
        }

        if(sortField == null || sortField.isEmpty()){
            sortField = "dateEncounter";
            sort = Sort.by(sortField).descending();
        } else {
            sort = Sort.by(sortField).descending();
        }

        if (sortOrder != null && sortOrder.equalsIgnoreCase("Asc")){
            sort = Sort.by(sortField).ascending();
        }

        return PageRequest.of(pageNumber, pageSize, sort);
    }

    /**Get a list of formData
     *
     * @param page page
     * @return FormData List
     */
    private List getFormData(List<Encounter> encounterList, Page page){
        List <Map> formDataList = new ArrayList();
        List<Encounter> encounters = new ArrayList();
        if(page == null) {
            encounters = encounterList;
        } else {
            encounters = page.getContent();
        }
        //First forEach loop
        encounters.forEach(encounter -> {
            //Check if encounter is archived
            if(encounter.getArchived() == 1) return;
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

    /**Get a list of Encounter By PatientId in Desc order
     *
     * @param patientId
     * @return Encounter List
     */
    private List<Encounter> getEncounterByPatientIdDesc(Long patientId){
        Specification<Encounter> specification = new GenericSpecification<Encounter>().findAllEncounterByPatientIdDesc(patientId, getOrganisationUnitId());

        return encounterRepository.findAll(specification);
    }

    public List<Form> getAllFormsByPatientIdAndProgramCode(Long patientId, String programCode) {

        //ArrayList<EncounterDistinctDTO> encounterDistinctDTOS = new ArrayList<>();
        Optional<Program> optionalProgram = programRepository.findProgramByCode(programCode);
        if(!optionalProgram.isPresent() || optionalProgram.get().getArchived() == 1){
            throw new EntityNotFoundException(Program.class, "programCode", programCode+"");
        }
        Program program = optionalProgram.get();
        List <Form> forms = new ArrayList<>();
        HashSet <String> filledFormSet = new HashSet<>();
        HashSet <String> formCodeSet = new HashSet<>();

        //Check for filled forms by the patient in that program
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UNARCHIVED).forEach(encounterDistinctDTO -> {
            filledFormSet.add(encounterDistinctDTO.getFormCode());
        });

        if(filledFormSet.size() > 0) {
            program.getFormsByProgram().forEach(form -> {
                //if form has been filled, then return
                if (filledFormSet.contains(form.getCode())) {
                   // filledFormSet.add(form.getCode());
                    formCodeSet.add(form.getCode());
                    return;
                }
                    //form not filled
                    //Check for formPrecedence
                if(form.getFormPrecedence() == null){
                    //form doesnt have precedence, so return form
                    formCodeSet.add(form.getCode());
                    return;
                }

                Set<String> formPrecedence = getFormPrecedence(form);
                //if all formPrecedence have been filled, return form.
                if(filledFormSet.containsAll(formPrecedence)){
                    formCodeSet.add(form.getCode());
                    return;
                }
            });

            formCodeSet.forEach(formCode ->{
                forms.add(formRepository.findByCode(formCode).get());
            });

        }else {
            program.getFormsByProgram().forEach(form -> {
                if(form.getFormPrecedence() == null){
                    forms.add(form);
                }
            });
        }
        return forms;
    }

    public List<Form> getFilledFormsByPatientIdAndProgramCode(Long patientId, String programCode) {
        List<Form> forms = new ArrayList<>();
        //Check for filled forms by the patient in that program
        encounterRepository.findDistinctPatientIdAndProgramCodeAndOrganisationUnitIdAndArchived(patientId, programCode, getOrganisationUnitId(), UNARCHIVED).forEach(encounterDistinctDTO -> {
            forms.add(formRepository.findByCode(encounterDistinctDTO.getFormCode()).get());
        });
        return forms;
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

    public List getAllProgramEnrolled(Long id) {
        return null;
    }

    public Long getTotalCount(){
        return patientRepository.countByOrganisationUnitIdAndArchived(getOrganisationUnitId(), UNARCHIVED);
    }

    public List<PatientDTO> getAllPatientsByProgramCode(String programCode ) {
        List<PatientDTO> patientDTOList = new ArrayList<>();
        encounterRepository.findDistinctProgramCodeAndOrganisationUnitIdAndArchived(programCode, getOrganisationUnitId(), UNARCHIVED).forEach(encounterDistinctDTO -> {
            patientDTOList.add(getPatientByHospitalNumber(patientRepository.findById(encounterDistinctDTO.getPatientId()).get().getHospitalNumber()));
        });
        return patientDTOList;
    }

    private Long getOrganisationUnitId(){
        return  userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
    }

    public List<PatientDTO> getPatients(List<Patient> patients){
        List<PatientDTO> patientDTOs = new ArrayList<>();
        patients.forEach(patient -> {
            Person person = patient.getPersonByPersonId();
            PersonContact personContact = person.getPersonContactsByPerson();

            Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patient.getId());
            PatientDTO patientDTO = visitOptional.isPresent() ? patientMapper.toPatientDTO(person, visitOptional.get(), personContact, patient) : patientMapper.toPatientDTO(person, personContact, patient);

            List<PersonRelative> personRelatives = person.getPersonRelativesByPerson();//personRelativeRepository.findByPersonId(person.getId());
            List<PersonRelativesDTO> personRelativeDTOs = new ArrayList<>();

            if (personRelatives.size() > 0) {
                personRelatives.forEach(personRelative -> {
                    if(personRelative.getArchived() == archived) return;
                    PersonRelativesDTO personRelativesDTO = personRelativeMapper.toPersonRelativeDTO(personRelative);
                    personRelativeDTOs.add(personRelativesDTO);
                });
                patientDTO.setPersonRelativeDTOs(personRelativeDTOs);
            }
            patientDTOs.add(patientDTO);
        });

        return patientDTOs;
    }
    //TOdo add a method to get patient Relative - to avoid duplicate codes


    /*public Page findPage(Pageable pageable){
        GenericSpecification<Patient> genericSpecification = new GenericSpecification<Patient>();
        Specification<Patient> specification = genericSpecification.findAll(0);

        Page<Patient> page = patientRepository.findAll(specification, pageable);
        //HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

        return page;
    }*/

    /*private Page getPage(){
        return page;
    }

    private void setPage(Page page){
        this.page = page;
    }*/

}
