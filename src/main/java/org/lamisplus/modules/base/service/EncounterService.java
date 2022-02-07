package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.FormDataDTO;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.dto.EncounterDTO;
import org.lamisplus.modules.base.domain.mapper.EncounterMapper;
import org.lamisplus.modules.base.domain.mapper.FormDataMapper;
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.JsonUtil;
import org.lamisplus.modules.base.util.converter.CustomDateTimeFormat;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class EncounterService {

    private static final int UNARCHIVED = 0;
    private final EncounterRepository encounterRepository;
    private final VisitRepository visitRepository;
    private final EncounterMapper encounterMapper;
    private final FormDataMapper formDataMapper;
    private final FormDataRepository formDataRepository;
    private final FormRepository formRepository;
    private final FormFlagRepository formFlagRepository;
    private final UserService userService;
    private final AccessRight accessRight;
    private static final int ARCHIVED = 1;
    private static final String WRITE = "write";
    private static final String DELETE = "delete";
    private final FlagService flagService;

    public List<EncounterDTO> getAllEncounters() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        List<EncounterDTO> encounterDTOS = new ArrayList();
        List<Encounter> encounters = encounterRepository.findAllByOrganisationUnitIdAndArchived(organisationUnitId, UNARCHIVED);
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();
        encounters.forEach(singleEncounter -> {
            //log.info("Encounter {}", singleEncounter);
            //filtering by user permission
            if(!accessRight.grantAccessForm(singleEncounter.getFormCode(), permissions)){
                return;
            }
            Patient patient = singleEncounter.getPatientByPatientId();
            Form form = singleEncounter.getFormForEncounterByFormCode();
            final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(patient, singleEncounter, form);
            List formDataList = new ArrayList();
            if(null == singleEncounter.getFormDataByEncounter() && !singleEncounter.getFormDataByEncounter().isEmpty()) {
                singleEncounter.getFormDataByEncounter().forEach(formData -> {
                    formDataList.add(formData);
                });
            }
            encounterDTO.setFormDataObj(formDataList);
            encounterDTOS.add(encounterDTO);
        });
        return encounterDTOS;
    }

    public EncounterDTO getEncounter(Long id) {
        Encounter encounter = encounterRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Encounter.class, "Id",id+"" ));
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        //Grant access
        accessRight.grantAccess(encounter.getFormCode(), Encounter.class, permissions);

        Patient patient = encounter.getPatientByPatientId();
        Form form = encounter.getFormForEncounterByFormCode();

        final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(patient, encounter, form);

        List<FormData> formDataList = encounter.getFormDataByEncounter();
        List formDataDTOList = new ArrayList();

        formDataList.forEach(formData -> {
            final FormDataDTO formDataDTO = this.formDataMapper.toFormDataDTO(formData);
            formDataDTOList.add(formDataDTO);
        });
        encounterDTO.setFormDataObj(formDataDTOList);
        return addProperties(encounterDTO);
    }

    public Encounter update(Long id, EncounterDTO encounterDTO) {
        Encounter encounter = encounterRepository.findByIdAndArchived(id, UNARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Encounter.class, "Id",id+"" ));

        accessRight.grantAccessByAccessType(encounter.getFormCode(),
                Encounter.class, WRITE, checkForEncounterAndGetPermission(id));

        encounter = encounterMapper.toEncounter(encounterDTO);
        encounter.setId(id);
        encounterRepository.save(encounter);
        return encounter;
    }

    public Encounter updateRetrospectiveData(Long id, EncounterDTO encounterDTO) {
        encounterRepository.findByIdAndArchived(id, UNARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Encounter.class, "Id",id+"" ));

        accessRight.grantAccessByAccessType(encounterDTO.getFormCode(),
                Encounter.class, WRITE, checkForEncounterAndGetPermission(id));

        final Encounter encounter = encounterMapper.toEncounter(encounterDTO);
        encounter.setId(id);

        if(encounterDTO.getData().size() > 0) {
            List<FormData> formDataList = new ArrayList<>();
            encounterDTO.getData().forEach(data -> {
                FormData formData = new FormData();
                formData.setEncounterId(encounter.getId());
                formData.setData(data);
                formData.setOrganisationUnitId(getOrganisationUnitId());
                formDataList.add(formData);
            });
            formDataRepository.deleteAllByEncounterId(encounter.getId());
            formDataRepository.saveAll(formDataList);
        }


        encounterRepository.save(encounter);
        return encounter;
    }

    public Encounter save(EncounterDTO encounterDTO, int formType) {
        //Get all permissions
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        //Grant access by access type = WRITE
        accessRight.grantAccessByAccessType(encounterDTO.getFormCode(), Encounter.class, WRITE, permissions);

        encounterDTO.setTimeCreated(CustomDateTimeFormat.LocalDateTimeByFormat(LocalDateTime.now(),"hh:mm a"));

        encounterRepository.findByPatientIdAndProgramCodeAndFormCodeAndDateEncounterAndOrganisationUnitId(
                encounterDTO.getPatientId(), encounterDTO.getFormCode(), encounterDTO.getProgramCode(),
                encounterDTO.getDateEncounter(), getOrganisationUnitId()).ifPresent(encounter -> {
            throw new RecordExistException(Encounter.class, "Patient Id ",
                    encounterDTO.getPatientId() + ", " + "Program Code = " +
                            encounterDTO.getProgramCode() + ", Form Code =" + encounterDTO.getFormCode() + ", Date =" +
                            encounterDTO.getDateEncounter());
        });

        final Encounter encounter = encounterMapper.toEncounter(encounterDTO);
        Visit visit = new Visit();
        Form form = formRepository.findByCodeAndArchived(encounterDTO.getFormCode(), UNARCHIVED).orElseThrow(()->
                new EntityNotFoundException(Encounter.class, "Form", "Not Found"));


        //For retrospective data entry formType is 1
        if(formType == 1) {
            if(form.getMainCode() != null){
                encounter.setFormCode(form.getMainCode());
            }
            visit = visitRepository.findTopByPatientIdAndDateVisitStartOrderByDateVisitStartDesc(encounterDTO.getPatientId(), encounter.getDateEncounter().toLocalDate()).orElse(null);
            if(visit == null) {
                visit = new Visit();
                visit.setDateVisitEnd(encounter.getDateEncounter().toLocalDate());
                visit.setDateVisitStart(encounter.getDateEncounter().toLocalDate());
                visit.setTimeVisitStart(LocalDateTime.now());
                visit.setTimeVisitEnd(LocalDateTime.now());
                visit.setDateNextAppointment(null);
                visit.setPatientId(encounter.getPatientId());
                visit.setTypePatient(0);
                visit.setOrganisationUnitId(getOrganisationUnitId());
                visit = visitRepository.save(visit);
            }
            encounter.setVisitId(visit.getId());
        } else {
            visit = visitRepository.findById(encounterDTO.getVisitId()).orElseThrow(() ->
                    new EntityNotFoundException(Visit.class, "Visit Id", encounterDTO.getVisitId() + ""));
        }

        encounter.setUuid(UUID.randomUUID().toString());
        encounter.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        encounter.setOrganisationUnitId(getOrganisationUnitId());
        Encounter savedEncounter = this.encounterRepository.save(encounter);

        if(encounterDTO.getTypePatient() != null) {
            visit.setTypePatient(encounterDTO.getTypePatient());
            visitRepository.save(visit);
        }

        if(encounterDTO.getData().size() > 0){
            encounterDTO.getData().forEach(formDataList->{
                FormData formData = new FormData();
                formData.setEncounterId(savedEncounter.getId());
                formData.setData(formDataList);
                formData.setOrganisationUnitId(getOrganisationUnitId());
                formDataRepository.save(formData);
            });
        }
        //Start of flag operation for associated with (0)
        List<FormFlag> formFlags = formFlagRepository.findByFormCodeAndStatusAndArchived(savedEncounter.getFormCode(), 0, UNARCHIVED);
        if(!formFlags.isEmpty()) {
            final Object finalFormData = formDataRepository.findOneByEncounterIdOrderByIdDesc(savedEncounter.getId()).get().getData();
            flagService.checkForAndSavePatientFlag(savedEncounter.getPatientId(), JsonUtil.getJsonNode(finalFormData), formFlags);
        }
        return savedEncounter;
    }

    public Integer delete(Long id) {
        Encounter encounter = encounterRepository.findByIdAndArchived(id, UNARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Encounter.class, "Id",id+"" ));
        accessRight.grantAccessByAccessType(encounter.getFormCode(), Encounter.class, DELETE, checkForEncounterAndGetPermission(id));

        encounter.setArchived(ARCHIVED);
        encounterRepository.save(encounter);
        return encounter.getArchived();
    }

    public Page<Encounter> getEncounterByFormCodeAndDateEncounter(String formCode, Optional<String> dateStart, Optional<String> dateEnd, Pageable pageable) {
        Specification<Encounter> specification = null;
        Set<String> permissions = accessRight.getAllPermissionForCurrentUser();

        accessRight.grantAccess(formCode, Encounter.class, permissions);

        specification = new GenericSpecification<Encounter>().findAllEncounter(formCode, dateStart, dateEnd, UNARCHIVED,
                getOrganisationUnitId());
        return encounterRepository.findAll(specification, pageable);
    }

    public List<EncounterDTO> getAllEncounters(Page page) {
        List<EncounterDTO> encounterDTOS = new ArrayList<>();

            List<Encounter> encounters = page.getContent();
            encounters.forEach(singleEncounter -> {
                Patient patient = singleEncounter.getPatientByPatientId();
                Form form = singleEncounter.getFormForEncounterByFormCode();
                List formDataList = new ArrayList();
                singleEncounter.getFormDataByEncounter().forEach(formData -> {
                    formDataList.add(formData);
                });
                final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(patient, singleEncounter, form);

                encounterDTO.setFormDataObj(formDataList);
                encounterDTOS.add(addProperties(encounterDTO));
            });
        return encounterDTOS;
    }

    public List getFormDataByEncounterId(Long encounterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new EntityNotFoundException(Encounter.class, "Id",encounterId+"" ));

        accessRight.grantAccess(encounter.getFormCode(), Encounter.class, checkForEncounterAndGetPermission(encounterId));
        List<FormData> formDataList = encounter.getFormDataByEncounter();
        return formDataList;
    }

    public Long getTotalCount(String programCode) {
        return encounterRepository.countByProgramCodeAndArchivedAndOrganisationUnitId(programCode, UNARCHIVED, getOrganisationUnitId());
    }

    public Page<Encounter> findEncounterPage(String firstName, String lastName, String hospitalNumber, String mobilePhoneNumber, String formCode, String dateStart, String dateEnd, Pageable pageable) {
        return encounterRepository.findEncounterPage(firstName,lastName,hospitalNumber, mobilePhoneNumber, formCode, dateStart, dateEnd, getOrganisationUnitId(),UNARCHIVED, pageable);
    }

    private Set<String> checkForEncounterAndGetPermission(Long id){
        return accessRight.getAllPermissionForCurrentUser();
    }

    private EncounterDTO addProperties(EncounterDTO encounterDTO) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            if (encounterDTO.getDetails() != null) {
                String encounterDetailsString = mapper.writeValueAsString(encounterDTO.getDetails());
                JSONObject encounterJson = new JSONObject(encounterDetailsString);
                if (encounterJson.get("firstName") != null)
                    encounterDTO.setFirstName(encounterJson.get("firstName").toString());
                if (encounterJson.get("hospitalNumber") != null)
                    encounterDTO.setHospitalNumber(encounterJson.get("hospitalNumber").toString());
                if (encounterJson.get("lastName") != null)
                    encounterDTO.setLastName(encounterJson.get("lastName").toString());
                if (encounterJson.get("dob") != null)
                    encounterDTO.setDob(LocalDate.parse(encounterJson.get("dob").toString(), formatter));
            }
        } catch (JSONException | JsonProcessingException e) {
            e.printStackTrace();
        }
        return encounterDTO;
    }

    private Long getOrganisationUnitId(){
        return userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

    }
}