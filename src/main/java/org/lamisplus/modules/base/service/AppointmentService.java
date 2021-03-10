package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.mapper.AppointmentMapper;
import org.lamisplus.modules.base.repository.AppointmentRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
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
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;
    private final GenericSpecification<Appointment> genericSpecification;
    private final UserService userService;

    public List<AppointmentDTO> getAllAppointment() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        List<Appointment> appointments = appointmentRepository.findAllByArchivedAndOrganisationUnitIdOrderByIdAsc(UN_ARCHIVED, organisationUnitId);

        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        appointments.forEach(appointment -> {
            Patient patient = appointment.getPatientByPatientId();
            Person person = patient.getPersonByPersonId();

            final AppointmentDTO appointmentDTO = appointmentMapper.toAppointmentDTO(appointment, person, patient);

            appointmentDTOS.add(appointmentDTO);
        });
        return appointmentDTOS;
    }

    public Appointment save(AppointmentDTO appointmentDTO) {
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setArchived(UN_ARCHIVED);
        return appointmentRepository.save(appointment);
    }

    public List<AppointmentDTO> getOpenAllAppointmentByPatientId(Long patientId) {
        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        List<Appointment> appointmentList = appointmentRepository.findAllByPatientIdAndArchivedAndVisitId(patientId, UN_ARCHIVED, null);
        appointmentList.forEach(appointment -> {
            appointmentDTOS.add(getAppointmentDTO(appointment));
        });
        return appointmentDTOS;
    }

    public AppointmentDTO getAppointment(Long id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!optionalAppointment.isPresent()) throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        Appointment appointment = optionalAppointment.get();

        return getAppointmentDTO(appointment);
    }

    public Appointment update(Long id, AppointmentDTO appointmentDTO) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!appointmentOptional.isPresent()) {
            throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        }
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setId(id);
        appointment.setArchived(UN_ARCHIVED);

        return appointmentRepository.save(appointment);
    }

    public Integer delete(Long id) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!appointmentOptional.isPresent()) throw new EntityNotFoundException(Appointment.class, "Display:", id + "");
        appointmentOptional.get().setArchived(ARCHIVED);

        return appointmentOptional.get().getArchived();
    }

    private AppointmentDTO getAppointmentDTO(Appointment appointment){
        Patient patient = appointment.getPatientByPatientId();
        Person person = patient.getPersonByPersonId();

        return  appointmentMapper.toAppointmentDTO(appointment, person, patient);
    }

}