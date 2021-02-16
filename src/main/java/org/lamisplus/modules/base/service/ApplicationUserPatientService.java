package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserPatientDTO;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.lamisplus.modules.base.domain.mapper.VisitMapper;
import org.lamisplus.modules.base.repository.ApplicationUserPatientRepository;
import org.lamisplus.modules.base.repository.VisitRepository;
import org.lamisplus.modules.base.util.CustomDateTimeFormat;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserPatientService {
    private final ApplicationUserPatientRepository applicationUserPatientRepository;
    private final UserService userService;
    private final PatientService patientService;


    public List<PatientDTO> getAllApplicationUserPatient(Long userId) {
        List<ApplicationUserPatient> optionalApplicationUserPatient = applicationUserPatientRepository.findAllByUserId(userId);
        List<Patient> patients = new ArrayList<>();
        optionalApplicationUserPatient.forEach(applicationUserPatient -> {
            patients.add(applicationUserPatient.getPatientByPatientId());
        });
            return patientService.getPatients(patients);
    }

    public List save(ApplicationUserPatientDTO applicationUserPatientDTO) {
        List<ApplicationUserPatient> applicationUserPatients  = new ArrayList<>();
        applicationUserPatientDTO.getPatientId().forEach(patientId ->{
            applicationUserPatients.add(new ApplicationUserPatient(applicationUserPatientDTO.getUserId(), patientId));
        });
        return applicationUserPatientRepository.saveAll(applicationUserPatients);
    }
}
