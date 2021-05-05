package org.lamisplus.modules.base.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.mapper.AppointmentMapper;
import org.lamisplus.modules.base.repository.AppointmentRepository;
import org.lamisplus.modules.base.util.Constant;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final Constant constant;
    private final UserService userService;

    public List<AppointmentDTO> getAllAppointment() {
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        List<Appointment> appointments = appointmentRepository.findAllByArchivedAndOrganisationUnitIdOrderByIdAsc(constant.UN_ARCHIVED, organisationUnitId);

        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        appointments.forEach(appointment -> {
            //Patient patient = appointment.getPatientByPatientId();
            //final AppointmentDTO appointmentDTO = appointmentMapper.toAppointmentDTO(appointment, patient);
            appointmentDTOS.add(getAppointmentDTO(appointment));
        });
        return appointmentDTOS;
    }

    public Appointment save(AppointmentDTO appointmentDTO) {
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setOrganisationUnitId(userService.getUserWithRoles().get().getCurrentOrganisationUnitId());
        appointment.setArchived(constant.UN_ARCHIVED);
        return appointmentRepository.save(appointment);
    }

    public List<AppointmentDTO> getOpenAllAppointmentByPatientId(Long patientId) {
        List<AppointmentDTO> appointmentDTOS = new ArrayList<>();
        List<Appointment> appointmentList = appointmentRepository.findAllByPatientIdAndArchivedAndVisitId(patientId, constant.UN_ARCHIVED, null);
        appointmentList.forEach(appointment -> {
            appointmentDTOS.add(getAppointmentDTO(appointment));
        });
        return appointmentDTOS;
    }

    public AppointmentDTO getAppointment(Long id) {
        Appointment appointment = appointmentRepository.findByIdAndArchived(id, constant.UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Appointment.class, "Display:", id + ""));

        return getAppointmentDTO(appointment);
    }

    public Appointment update(Long id, AppointmentDTO appointmentDTO) {
        appointmentRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Appointment.class, "Display:", id + ""));
        final Appointment appointment = appointmentMapper.toAppointment(appointmentDTO);
        appointment.setId(id);
        appointment.setArchived(constant.UN_ARCHIVED);

        return appointmentRepository.save(appointment);
    }

    public Integer delete(Long id) {
        Appointment appointment =  appointmentRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(Appointment.class, "Display:", id + ""));
        appointment.setArchived(constant.ARCHIVED);
        return appointment.getArchived();
    }

    private AppointmentDTO getAppointmentDTO(Appointment appointment){
        Patient patient = appointment.getPatientByPatientId();

        AppointmentDTO appointmentDTO =   appointmentMapper.toAppointmentDTO(appointment, patient);

        try {
            //Instance of ObjectMapper provides functionality for reading and writing JSON
            ObjectMapper mapper = new ObjectMapper();
            if (appointmentDTO.getDetails() != null) {
                String patientDetailsString = mapper.writeValueAsString(appointmentDTO.getDetails());
                JSONObject patientDetailsJson = new JSONObject(patientDetailsString);
                if (patientDetailsJson.get("firstName") != null) appointmentDTO.setFirstName(patientDetailsJson.get("firstName").toString());
                if (patientDetailsJson.get("lastName") != null) appointmentDTO.setLastName(patientDetailsJson.get("lastName").toString());
               }
        } catch (JSONException | JsonProcessingException e) {
            e.printStackTrace();
        }
        return appointmentDTO;
    }
}