package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.AccessDeniedException;
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
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

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
    private final UserService userService;
    //private final GenericSpecification<Encounter> genericSpecification;
    private final AccessRight accessRight;
    private static final int ARCHIVED = 1;
    //private static final String READ = "read";
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
        Optional<Encounter> encounterOptional = encounterRepository.findById(id);
        if(!encounterOptional.isPresent() || encounterOptional.get().getArchived()== ARCHIVED) {
            throw new EntityNotFoundException(Encounter.class, "Id",id+"" );
        }
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccess(encounterOptional.get().getFormCode(), Encounter.class, permissions);

        Encounter encounter = encounterOptional.get();

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
        Optional<Encounter> optionalEncounter = encounterRepository.findByIdAndArchived(id, UNARCHIVED);


        accessRight.grantAccessByAccessType(optionalEncounter.get().getFormCode(),
                Encounter.class, WRITE, checkForEncounterAndGetPermission(optionalEncounter, id));

        Encounter encounter = encounterMapper.toEncounter(encounterDTO);
        encounter.setId(id);
        //encounter.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        encounterRepository.save(encounter);
        return encounter;
    }

    public Encounter save(EncounterDTO encounterDTO) {
        Set<String> permissions = accessRight.getAllPermission();

        accessRight.grantAccessByAccessType(encounterDTO.getFormCode(), Encounter.class, WRITE, permissions);
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        encounterDTO.setTimeCreated(CustomDateTimeFormat.LocalTimeByFormat(LocalTime.now(),"hh:mm a"));
        Optional<Encounter> encounterOptional = this.encounterRepository.findByPatientIdAndProgramCodeAndFormCodeAndDateEncounterAndOrganisationUnitId(encounterDTO.getPatientId(), encounterDTO.getFormCode(),
                encounterDTO.getProgramCode(), encounterDTO.getDateEncounter(), organisationUnitId);

        if (encounterOptional.isPresent()) {
            throw new RecordExistException(Encounter.class, "Patient Id ", encounterDTO.getPatientId() + ", " +
                    "Program Code = " + encounterDTO.getProgramCode() + ", Form Code =" + encounterDTO.getFormCode() + ", Date =" + encounterDTO.getDateEncounter());
        }

        /*Optional <Patient> patientOptional = this.patientRepository.findById(encounterDTO.getPatientId());
        if(!patientOptional.isPresent()) throw new EntityNotFoundException(Patient.class,"Patient Id", patientOptional.get().getId().toString());

        Optional<Form> formOptional = formRepository.findByCode(encounterDTO.getFormCode());
        if(!formOptional.isPresent()) throw new EntityNotFoundException(Form.class,"Form Code", encounterDTO.getFormCode());

        Optional<Program> programOptional = this.programRepository.findByCode(encounterDTO.getProgramCode());
        if(!programOptional.isPresent())throw new EntityNotFoundException(Program.class,"Program Code", encounterDTO.getProgramCode());
        */

        Optional<Visit> visitOptional = this.visitRepository.findById(encounterDTO.getVisitId());
        if(!visitOptional.isPresent())throw new EntityNotFoundException(Visit.class,"Visit Id", encounterDTO.getVisitId()+"");

        final Encounter encounter = encounterMapper.toEncounter(encounterDTO);
        encounter.setUuid(UuidGenerator.getUuid());
        encounter.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        encounter.setOrganisationUnitId(organisationUnitId);

        Encounter savedEncounter = this.encounterRepository.save(encounter);

        Visit visit = visitOptional.get();
        if(encounterDTO.getTypePatient() != null){
            visit.setTypePatient(encounterDTO.getTypePatient());
            this.visitRepository.save(visit);
        }

        if(encounterDTO.getData().size() >0){
            encounterDTO.getData().forEach(formDataList->{
                FormData formData = new FormData();
                formData.setEncounterId(savedEncounter.getId());
                formData.setData(formDataList);
                this.formDataRepository.save(formData);
            });
        }
        return savedEncounter;
    }

    public Integer delete(Long id) {
        Optional<Encounter> optionalEncounter = encounterRepository.findByIdAndArchived(id, UNARCHIVED);

        accessRight.grantAccessByAccessType(optionalEncounter.get().getFormCode(),
                Encounter.class, DELETE, checkForEncounterAndGetPermission(optionalEncounter, id));

        optionalEncounter.get().setArchived(ARCHIVED);
        //optionalEncounter.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return optionalEncounter.get().getArchived();
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
        Optional<Encounter> optionalEncounter = encounterRepository.findById(encounterId);

        accessRight.grantAccess(optionalEncounter.get().getFormCode(), Encounter.class, checkForEncounterAndGetPermission(optionalEncounter, encounterId));

        List<FormData> formDataList = optionalEncounter.get().getFormDataByEncounter();
        return formDataList;
    }

    public Long getTotalCount(String programCode) {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        return encounterRepository.countByProgramCodeAndArchivedAndOrganisationUnitId(programCode, UNARCHIVED, organisationUnitId);
    }

    private Set<String> checkForEncounterAndGetPermission(Optional<Encounter> optionalEncounter, Long id){
        if(!optionalEncounter.isPresent()) {
            throw new EntityNotFoundException(Encounter.class, "Id",id+"" );
        }
        return accessRight.getAllPermission();
    }
}
