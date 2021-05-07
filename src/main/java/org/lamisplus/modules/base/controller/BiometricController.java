package org.lamisplus.modules.base.controller;

import org.lamisplus.modules.base.domain.dto.BiometricResult;
import org.lamisplus.modules.base.domain.entity.Biometric;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.repository.BiometricRepository;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/biometrics/templates")
public class BiometricController {
    private final BiometricRepository biometricRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public BiometricController(PatientRepository patientRepository, BiometricRepository biometricRepository) {
        this.patientRepository = patientRepository;
        this.biometricRepository = biometricRepository;
    }


    @PostMapping("/api/biometrics/templates")
    public void saveBiometric(@RequestBody List<Biometric> biometrics) {
        biometricRepository.saveAll(biometrics);
    }

    @GetMapping("/biometrics")
    public List<Biometric> biometrics() {
        return biometricRepository.findAll();
    }

    @GetMapping("/api/biometrics/{id}")
    public ResponseEntity<Biometric> getBiometric(@PathVariable Long id) throws Exception {
        Optional<Biometric> biometric = biometricRepository.findById(id);
        return ResponseEntity.ok(biometric.orElseThrow(
                () -> new Exception("there is no biometric for the client with this Id ->: " + id)));
    }

    @DeleteMapping("/api/biometrics/{id}")
    public ResponseEntity<String> deleteBiometric(@PathVariable Long id) {
        biometricRepository.deleteById(id);
        return ResponseEntity.ok("delete was successful");
    }

    @GetMapping("/api/biometrics/patient/{id}")
    public List<Biometric> findByPatient(@PathVariable Long id) throws Exception {
        final Patient patient = patientRepository
                .findById(id)
                .orElseThrow(() -> new Exception("there is no patient  with this Id ->: " + id));
        return biometricRepository.findBiometricByPatient(patient);

    }

    @PostMapping("/biometrics/update-templates/{}")
    public void updateTemplates(@RequestBody List<BiometricResult> list) {
        list.forEach(e -> biometricRepository
                .findById(e.getId())
                .ifPresent(biometric -> {
                    try {
                        biometric.setTemplate(e.getTemplate());
                        biometric.setIso(true);
                        biometricRepository.save(biometric);
                    } catch (Exception ioException) {
                        ioException.printStackTrace();
                    }
                }));
    }
}
