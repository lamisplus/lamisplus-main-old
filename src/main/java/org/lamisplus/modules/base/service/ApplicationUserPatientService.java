package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserPatientDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.repository.ApplicationUserPatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientService {
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private final UserService userService;

    public List<ApplicationUserPatient> save(ApplicationUserPatientDTO applicationUserPatientDTO) {
        Long orgUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        Long userId = applicationUserPatientDTO.getUserId();
        String programCode = applicationUserPatientDTO.getProgramCode();
        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();

        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            applicationUserPatientRepository.findAllByPatientIdAndUserIdAndProgramCodeAndArchived(patientId, userId, programCode, UN_ARCHIVED)
                    .ifPresent(applicationUserPatient -> {
                        throw new RecordExistException(ApplicationUserPatient.class,"patientId & userId:",patientId+" & " + userId +" in same program");
                    });
            ApplicationUserPatient applicationUserPatient = new ApplicationUserPatient(userId, patientId);
            applicationUserPatient.setOrganisationUnitId(orgUnitId);
            applicationUserPatient.setProgramCode(programCode);
            applicationUserPatient.setArchived(UN_ARCHIVED);
            applicationUserPatients.add(applicationUserPatient);
        });
        return applicationUserPatientRepository.saveAll(applicationUserPatients);
    }

    public ApplicationUserPatientDTO update(Long id, ApplicationUserPatientDTO applicationUserPatientDTO) {
        applicationUserPatientRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(ApplicationUserPatient.class,"id:",id+""));

        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            applicationUserPatients.add(new ApplicationUserPatient(applicationUserPatientDTO.getUserId(), patientId));
        });
        applicationUserPatientRepository.saveAll(applicationUserPatients);
        return applicationUserPatientDTO;
    }

    public List<ApplicationUserPatient> unassignCaseManagerToPatient(ApplicationUserPatientDTO applicationUserPatientDTO) {
        Long userId = applicationUserPatientDTO.getUserId();

        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            ApplicationUserPatient applicationUserPatient = applicationUserPatientRepository.findAllByPatientIdAndUserIdAndArchived(patientId, userId, UN_ARCHIVED)
                    .orElseThrow(() -> new EntityNotFoundException(ApplicationUserPatient.class,"patientId & userId:",patientId+" & " + userId));
            applicationUserPatient.setArchived(ARCHIVED);
            applicationUserPatients.add(applicationUserPatient);
        });
        return applicationUserPatientRepository.saveAll(applicationUserPatients);
    }

    public Integer delete(Long id){
        ApplicationUserPatient applicationUserPatient = applicationUserPatientRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserPatient.class,"Id:",id+""));
        applicationUserPatient.setArchived(1);
        applicationUserPatientRepository.save(applicationUserPatient);
        return applicationUserPatient.getArchived();
    }
}
