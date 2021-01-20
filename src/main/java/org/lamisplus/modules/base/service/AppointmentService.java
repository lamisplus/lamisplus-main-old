package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.domain.mapper.AppointmentMapper;
import org.lamisplus.modules.base.repository.AppointmentRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
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
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final UserService userService;
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;
    private final GenericSpecification<Appointment> genericSpecification;

    public List<AppointmentDTO> getAllAppointment() {
        Specification<Appointment> appointmentSpecification = genericSpecification.findAll(0);
        List<Appointment> appointments = appointmentRepository.findAll(appointmentSpecification);

        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        appointments.forEach(appointment -> {
            final AppointmentDTO appointmentDTO = appointmentMapper.toAppointmentDTO(appointment);
            appointmentDTOS.add(appointmentDTO);
        });
        return appointmentDTOS;
    }

    public Appointment save(AppointmentDTO appointmentDTO) {
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        appointment.setArchived(UN_ARCHIVED);
        return appointmentRepository.save(appointment);
    }

    public List<AppointmentDTO> getOpenAllAppointmentByPatientId(Long patientId) {
        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        List<Appointment> appointmentList = appointmentRepository.findAllByPatientIdAndArchivedAndVisitId(patientId, UN_ARCHIVED, null);
        appointmentList.forEach(appointment -> {
            final AppointmentDTO appointmentDTO = appointmentMapper.toAppointmentDTO(appointment);
            appointmentDTOS.add(appointmentDTO);
        });
        return appointmentDTOS;
    }

    public AppointmentDTO getAppointment(Long id) {
        Optional<Appointment> appointment = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!appointment.isPresent()) throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        return appointmentMapper.toAppointmentDTO(appointment.get());
    }

    public Appointment update(Long id, AppointmentDTO appointmentDTO) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!appointmentOptional.isPresent()) {
            throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        }
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setId(id);
        appointment.setArchived(UN_ARCHIVED);
        appointment.setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return appointmentRepository.save(appointment);
    }

    public Integer delete(Long id) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!appointmentOptional.isPresent()) throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        appointmentOptional.get().setArchived(ARCHIVED);
        appointmentOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return appointmentOptional.get().getArchived();
    }

}