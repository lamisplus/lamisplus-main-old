package org.lamisplus.modules.base.util;

import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.repository.PatientRepository;

import java.util.Optional;

public class PatientIdentifier {
    private final PatientRepository patientRepository;
    public PatientIdentifier(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public String getHospitalNumber (Long clientId) {
        String hospitalNumber = "";
        Optional<Patient> patient = patientRepository.findById(clientId);
        if(patient.isPresent()) {
            hospitalNumber = patient.get().getHospitalNumber();
        }
        return  hospitalNumber;
    }
}
