package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.dto.PatientList;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.PersonContact;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Person toPerson(PatientDTO patientDTO);

    PersonContact toPersonContact(PatientDTO patientDTO);

    Patient toPatient(PatientDTO patientDTO);


    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="visit.id", target="visitId"),
            @Mapping(source="patient.id", target="patientId")
    })
    PatientDTO toPatientDTO(Person person, Visit visit, PersonContact personContact, Patient patient);
    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="patient.id", target="patientId")
    })
    PatientDTO toPatientDTO(Person person, PersonContact personContact, Patient patient);

    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="patient.id", target="patientId")
    })
    PatientList toPatientListDTO(Person person, PersonContact personContact, Patient patient);

    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="patient.id", target="patientId")
    })
    PatientList toPatientListDTO(Person person, Visit visit, PersonContact personContact, Patient patient);
}
