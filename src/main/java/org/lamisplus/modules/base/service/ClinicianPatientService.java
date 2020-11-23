package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ClinicianPatientDTO;
import org.lamisplus.modules.base.domain.entity.ClinicianPatient;
import org.lamisplus.modules.base.domain.mapper.ClinicianPatientMapper;
import org.lamisplus.modules.base.repository.ClinicianPatientRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ClinicianPatientService {

    private final ClinicianPatientRepository clinicianPatientRepository;
    private final ClinicianPatientMapper clinicianPatientMapper;
    private final UserService userService;

    public ClinicianPatient save(ClinicianPatientDTO clinicianPatientDTO) {
        Optional<ClinicianPatient> clinicianPatientOptional = clinicianPatientRepository.findByClinicianIdAndPatientIdAndVisitId(clinicianPatientDTO.getClinicianId(),
                clinicianPatientDTO.getPatientId(), clinicianPatientDTO.getVisitId());

        if(clinicianPatientOptional.isPresent()) {
            throw new RecordExistException(ClinicianPatient.class, "Clinician Id", clinicianPatientDTO.getClinicianId() +
                    ", Patient Id=" + clinicianPatientDTO.getPatientId() +", Visit Id=" + clinicianPatientDTO.getVisitId());
        }
        final ClinicianPatient clinicianPatient = clinicianPatientMapper.toClinicianPatient(clinicianPatientDTO);
        clinicianPatient.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        clinicianPatient.setUuid(UuidGenerator.getUuid());
        clinicianPatient.setArchived(0);

        return clinicianPatientRepository.save(clinicianPatient);
    }

    public List getAllClinicianPatients() {
        GenericSpecification<ClinicianPatient> genericSpecification = new GenericSpecification<ClinicianPatient>();
        Specification<ClinicianPatient> specification = genericSpecification.findAll(0);
        return clinicianPatientRepository.findAll(specification);
    }

    public ClinicianPatient update(Long id, ClinicianPatientDTO clinicianPatientDTO) {
        Optional<ClinicianPatient> clinicianPatientOptional = clinicianPatientRepository.findById(id);
        if(!clinicianPatientOptional.isPresent())throw new EntityNotFoundException(ClinicianPatient.class, "Id", "Not Found");
        final ClinicianPatient clinicianPatient = clinicianPatientMapper.toClinicianPatient(clinicianPatientDTO);
        clinicianPatient.setId(id);
        clinicianPatient.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return clinicianPatientRepository.save(clinicianPatient);
    }

    public ClinicianPatientDTO getClinicianPatient(Long id){
        Optional<ClinicianPatient> clinicianPatientOptional = clinicianPatientRepository.findById(id);
        if(!clinicianPatientOptional.isPresent())throw new EntityNotFoundException(ClinicianPatient.class, "Id", "Not Found");
        final ClinicianPatientDTO clinicianPatientDTO = clinicianPatientMapper.toClinicianPatientDTO(clinicianPatientOptional.get());
        return clinicianPatientDTO;
    }

    public Integer delete(Long id){
        Optional<ClinicianPatient> clinicianPatientOptional = clinicianPatientRepository.findById(id);
        if(!clinicianPatientOptional.isPresent() || clinicianPatientOptional.get().getArchived() == 1) throw new EntityNotFoundException(ClinicianPatient.class,"Display:",id+"");
        clinicianPatientOptional.get().setArchived(1);
        clinicianPatientOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return clinicianPatientOptional.get().getArchived();
    }
}
