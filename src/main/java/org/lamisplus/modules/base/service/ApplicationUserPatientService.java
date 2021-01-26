package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserPatientDTO;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.domain.mapper.ApplicationUserPatientMapper;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.repository.ApplicationUserPatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientService {
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    //private final UserService userService;
    private final PatientService patientService;
    //private final ApplicationUserPatientMapper applicationUserPatientMapper;
    private final UserMapper userMapper;



    public List<PatientDTO> getAllPatientByUserId(Long userId) {
        List<ApplicationUserPatient> applicationUserPatients = applicationUserPatientRepository.findAllByUserId(userId);
        List<Patient> patients = new ArrayList<>();
        applicationUserPatients.forEach(applicationUserPatient -> {
            patients.add(applicationUserPatient.getPatientByPatientId());
        });
            return patientService.getPatients(patients);
    }

    public UserDTO getAllApplicationUserByPatientId(Long patientId) {
        Optional<ApplicationUserPatient> optionalApplicationUserPatient = applicationUserPatientRepository.findAllByPatientId(patientId);
        if(!optionalApplicationUserPatient.isPresent()) throw new EntityNotFoundException(ApplicationUserPatient.class,"patientId:",patientId+"");

        return userMapper.userToUserDTO(optionalApplicationUserPatient.get().getApplicationUserByApplicationUserId());
    }

    public List save(ApplicationUserPatientDTO applicationUserPatientDTO) {
        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            applicationUserPatients.add(new ApplicationUserPatient(applicationUserPatientDTO.getUserId(), patientId));
        });
        return applicationUserPatientRepository.saveAll(applicationUserPatients);
    }

    public ApplicationUserPatientDTO update(Long id, ApplicationUserPatientDTO applicationUserPatientDTO) {
        Optional<ApplicationUserPatient> optionalApplicationUserPatient = applicationUserPatientRepository.findById(id);
        if(!optionalApplicationUserPatient.isPresent()) throw new EntityNotFoundException(ApplicationUserPatient.class,"id:",id+"");

        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientIds().forEach(patientId ->{
            applicationUserPatients.add(new ApplicationUserPatient(applicationUserPatientDTO.getUserId(), patientId));
        });
        applicationUserPatientRepository.saveAll(applicationUserPatients);
        return applicationUserPatientDTO;
    }
}
