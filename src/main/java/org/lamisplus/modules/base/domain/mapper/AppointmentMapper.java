package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    Appointment toAppointment(AppointmentDTO appointmentDTO);

    @Mappings({
            @Mapping(source="appointment.id", target="id"),
    })
    AppointmentDTO toAppointmentDTO(Appointment appointment, Patient patient);

    List<Appointment> toAppointmentList(List<AppointmentDTO> appointmentDTOS);

}
