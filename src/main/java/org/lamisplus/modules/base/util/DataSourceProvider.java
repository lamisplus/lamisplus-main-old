package org.lamisplus.modules.base.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.PatientList;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.mapper.EncounterMapper;
import org.lamisplus.modules.base.domain.mapper.PatientMapper;
import org.lamisplus.modules.base.domain.mapper.PersonRelativeMapper;
import org.lamisplus.modules.base.domain.mapper.VisitMapper;
import org.lamisplus.modules.base.repository.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DataSourceProvider {
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
    private final Integer archived = 1; 

    public List<PatientList> patientList() {
        GenericSpecification<Patient> genericSpecification = new GenericSpecification<Patient>();
        Specification<Patient> specification = genericSpecification.findAll(0);

        List<Patient> patients = patientRepository.findAll(specification);
        List<PatientList> patientLists = new ArrayList<>();
        patients.forEach(patient -> {
            Person person = patient.getPersonByPersonId();
            PersonContact personContact = person.getPersonContactsByPerson();

            Optional<Visit> visitOptional = visitRepository.findTopByPatientIdAndDateVisitEndIsNullOrderByDateVisitStartDesc(patient.getId());
            PatientList patientList = visitOptional.isPresent() ? patientMapper.toPatientListDTO(person, visitOptional.get(), personContact, patient) : patientMapper.toPatientListDTO(person, personContact, patient);

            patientLists.add(patientList);
        });
        return patientLists;
    }

}
