package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserPatientDTO;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.repository.ApplicationUserPatientRepository;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientService {
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private final PatientService patientService;
    private final UserMapper userMapper;
    private final PatientRepository patientRepository;
    private static final int UN_ARCHIVED = 0;

    public List<PatientDTO> getAllPatientByUserId(Long userId) {
        List<Patient> patients = new ArrayList<>();
        applicationUserPatientRepository.findAllByUserId(userId).forEach(applicationUserPatient -> {
            patients.add(applicationUserPatient.getPatientByPatientId());
        });
            return patientService.getPatients(patients);
    }

    public UserDTO getAllApplicationUserByPatientId(Long patientId) {
        ApplicationUserPatient applicationUserPatient = applicationUserPatientRepository.findAllByPatientIdAndArchived(patientId, 0)
                .orElseThrow(() ->new EntityNotFoundException(ApplicationUserPatient.class,"patientId:",patientId+""));

        return userMapper.userToUserDTO(applicationUserPatient.getApplicationUserByApplicationUserId());
    }

    public List save(ApplicationUserPatientDTO applicationUserPatientDTO) {
        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            applicationUserPatients.add(new ApplicationUserPatient(applicationUserPatientDTO.getUserId(), patientId));
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

    private List<Long> getPatientIds(String programCode){
        List<Long> patientIds = new ArrayList();
        patientService.getAllPatientsByProgramCode(programCode).forEach(patientDTO -> {
            patientIds.add(patientDTO.getPatientId());
        });
        return patientIds;
    }

    public List<PatientDTO> getPatientsNotCaseManaged(String programCode) {
        List<Long> patientList = getPatientIds(programCode);

        applicationUserPatientRepository.findAllByPatientIdIn(getPatientIds(programCode)).forEach(appUserPatient ->{
            if(appUserPatient.getArchived() != null && appUserPatient.getArchived() != 0){
                return;
            } else {
                patientList.remove(appUserPatient.getPatientId());
            }
        });

        return patientService.getPatients(patientRepository.findAllByIdIn(patientList));
    }
}
