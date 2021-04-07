package org.lamisplus.modules.base.domain.mapper;


import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface VisitMapper {
    Visit toVisit(VisitDTO visitDTO);
    VisitDTO toVisitDTO(Visit visit);

    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="visit.id", target="id")
    })
    VisitDTO toVisitDTO(Visit visit, Person person);

    @Mappings({
            @Mapping(source="person.id", target="personId"),
            @Mapping(source="patient.id", target="patientId"),
            @Mapping(source="visit.id", target="id")
    })
    VisitDTO toVisitDTO(Visit visit, Person person, Patient patient);
}
