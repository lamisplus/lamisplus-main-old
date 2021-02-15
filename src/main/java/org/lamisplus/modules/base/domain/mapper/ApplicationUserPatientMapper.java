package org.lamisplus.modules.base.domain.mapper;


import org.lamisplus.modules.base.domain.dto.ApplicationUserPatientDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserPatient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApplicationUserPatientMapper {

    ApplicationUserPatient toApplicationUserPatient(ApplicationUserPatientDTO applicationUserPatientDTO);

    ApplicationUserPatientDTO toApplicationUserPatienttDTO(ApplicationUserPatient applicationUserPatient);
}
