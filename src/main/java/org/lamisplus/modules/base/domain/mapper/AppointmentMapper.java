package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    Appointment toAppointment(AppointmentDTO appointmentDTO);

    AppointmentDTO toAppointmentDTO(Appointment appointment);

    List<Appointment> toAppointmentList(List<AppointmentDTO> appointmentDTOS);

}
