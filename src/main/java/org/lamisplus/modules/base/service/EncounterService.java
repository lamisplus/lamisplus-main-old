package org.lamisplus.modules.base.service;

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

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.lamisplus.modules.base.util.AccessRight;
import org.lamisplus.modules.base.util.CustomDateTimeFormat;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final VisitRepository visitRepository;
    private final EncounterMapper encounterMapper;
    private final FormDataMapper formDataMapper;
    private final FormDataRepository formDataRepository;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final AccessRight accessRight;
    private static final int ARCHIVED = 1;
    private static final String WRITE = "write";
    private static final String DELETE = "delete";





    public List<EncounterDTO> getAllEncounters() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        List<EncounterDTO> encounterDTOS = new ArrayList();
        List<Encounter> encounters = encounterRepository.findAllByOrganisationUnitIdAndArchived(organisationUnitId, UNARCHIVED);
        Set<String> permissions = accessRight.getAllPermission();
        encounters.forEach(singleEncounter -> {
            if(!accessRight.grantAccessForm(singleEncounter.getFormCode(), permissions)){
                return;
            }
            Patient patient = singleEncounter.getPatientByPatientId();
            Person person = patient.getPersonByPersonId();
            Form form = singleEncounter.getFormForEncounterByFormCode();
            final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(person, patient, singleEncounter, form);
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
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(encounter.getFormCode(), Encounter.class, permissions);

        Patient patient = encounter.getPatientByPatientId();

        Person person = patient.getPersonByPersonId();

        Form form = encounter.getFormForEncounterByFormCode();

        final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(person, patient, encounter, form);

        List<FormData> formDataList = encounter.getFormDataByEncounter();
        List formDataDTOList = new ArrayList();

        formDataList.forEach(formData -> {
            final FormDataDTO formDataDTO = this.formDataMapper.toFormDataDTO(formData);
            formDataDTOList.add(formDataDTO);
        });
        encounterDTO.setFormDataObj(formDataDTOList);
        return encounterDTO;
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

    public Encounter save(EncounterDTO encounterDTO) {
        //Get all permissions
        Set<String> permissions = accessRight.getAllPermission();

        //Grant access by access type = WRITE
        accessRight.grantAccessByAccessType(encounterDTO.getFormCode(), Encounter.class, WRITE, permissions);
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        encounterDTO.setTimeCreated(CustomDateTimeFormat.LocalTimeByFormat(LocalTime.now(),"hh:mm a"));

        encounterRepository.findByPatientIdAndProgramCodeAndFormCodeAndDateEncounterAndOrganisationUnitId(
                encounterDTO.getPatientId(), encounterDTO.getFormCode(), encounterDTO.getProgramCode(),
                encounterDTO.getDateEncounter(), organisationUnitId).ifPresent(encounter -> {
            throw new RecordExistException(Encounter.class, "Patient Id ",
                    encounterDTO.getPatientId() + ", " + "Program Code = " +
                            encounterDTO.getProgramCode() + ", Form Code =" + encounterDTO.getFormCode() + ", Date =" +
                            encounterDTO.getDateEncounter());
        });

        final Encounter encounter = encounterMapper.toEncounter(encounterDTO);
        Visit visit = new Visit();

        //For retrospective data entry formType is 1
        if(encounter.getFormForEncounterByFormCode() != null){
            if(encounter.getFormForEncounterByFormCode().getType() == 1){
                visit.setDateVisitEnd(encounter.getDateEncounter());
                visit.setDateVisitStart(encounter.getDateEncounter());
                visit.setTimeVisitStart(LocalTime.now());
                visit.setTimeVisitEnd(LocalTime.now());
                visit.setDateNextAppointment(null);
                visit.setPatientId(encounter.getPatientId());
                visit.setTypePatient(0);
                visit.setOrganisationUnitId(organisationUnitId);
                visit = visitRepository.save(visit);

                encounterDTO.setVisitId(visit.getId());
            }
        }
        visit = visitRepository.findById(encounterDTO.getVisitId()).orElseThrow(() ->
                new EntityNotFoundException(Visit.class,"Visit Id", encounterDTO.getVisitId()+""));

        encounter.setUuid(UUID.randomUUID().toString());
        encounter.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        encounter.setOrganisationUnitId(organisationUnitId);

        Encounter savedEncounter = this.encounterRepository.save(encounter);

        if(encounterDTO.getTypePatient() != null & encounter.getFormForEncounterByFormCode().getType() != 1){
            visit.setTypePatient(encounterDTO.getTypePatient());
            visitRepository.save(visit);
        }

        if(encounterDTO.getData().size() >0){
            encounterDTO.getData().forEach(formDataList->{
                FormData formData = new FormData();
                formData.setEncounterId(savedEncounter.getId());
                formData.setData(formDataList);
                formData.setOrganisationUnitId(organisationUnitId);
                formDataRepository.save(formData);
            });
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

    public List<EncounterDTO> getEncounterByFormCodeAndDateEncounter(String formCode, Optional<String> dateStart, Optional<String> dateEnd) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(formCode, Encounter.class, permissions);
        List<EncounterDTO> encounterDTOS = new ArrayList<>();
        List<Encounter> encounters = encounterRepository.findAll(new Specification<Encounter>() {
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if(dateStart.isPresent() && !dateStart.get().equals("{dateStart}")){
                    LocalDate localDate = LocalDate.parse(dateStart.get(), DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    predicates.add(criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get("dateEncounter").as(LocalDate.class), localDate)));
                }

                if(dateEnd.isPresent() && !dateEnd.get().equals("{dateEnd}")){
                    LocalDate localDate = LocalDate.parse(dateEnd.get(), DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    predicates.add(criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(root.get("dateEncounter").as(LocalDate.class), localDate)));
                }
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("formCode"), formCode)));
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
                criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));

                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        });

        encounters.forEach(singleEncounter -> {
            Patient patient = singleEncounter.getPatientByPatientId();
            Person person = patient.getPersonByPersonId();
            Form form = singleEncounter.getFormForEncounterByFormCode();
            List formDataList = new ArrayList();
            singleEncounter.getFormDataByEncounter().forEach(formData -> {
                formDataList.add(formData);
            });
            final EncounterDTO encounterDTO = encounterMapper.toEncounterDTO(person, patient, singleEncounter, form);

            encounterDTO.setFormDataObj(formDataList);
            encounterDTOS.add(encounterDTO);
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
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        return encounterRepository.countByProgramCodeAndArchivedAndOrganisationUnitId(programCode, UNARCHIVED, organisationUnitId);
    }

    private Set<String> checkForEncounterAndGetPermission(Long id){
        return accessRight.getAllPermission();
    }
}