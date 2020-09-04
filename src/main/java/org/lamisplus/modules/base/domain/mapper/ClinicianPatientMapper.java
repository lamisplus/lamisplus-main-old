package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.ClinicianPatientDTO;
import org.lamisplus.modules.base.domain.entity.ClinicianPatient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClinicianPatientMapper {

    ClinicianPatient toClinicianPatient(ClinicianPatientDTO clinicianPatientDTO);

    ClinicianPatientDTO toClinicianPatientDTO(ClinicianPatient clinicianPatient);

}
