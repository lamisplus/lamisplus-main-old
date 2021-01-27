package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Slf4j
@RequiredArgsConstructor
@Audit
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        return ResponseEntity.ok(this.appointmentService.getAllAppointment());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getOpenAllAppointmentByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(this.appointmentService.getOpenAllAppointmentByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<Appointment> save(@RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(this.appointmentService.save(appointmentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(this.appointmentService.update(id, appointmentDTO));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.appointmentService.delete(id));
    }
}
