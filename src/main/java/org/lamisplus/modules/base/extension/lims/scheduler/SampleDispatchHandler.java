package org.lamisplus.modules.base.extension.lims.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.extension.lims.*;
import org.lamisplus.modules.base.extension.lims.Container;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.lamisplus.modules.base.repository.PersonRepository;
import org.lamisplus.modules.base.util.CodeSetResolver;
import org.lamisplus.modules.base.util.HttpConnectionManager;
import org.lamisplus.modules.base.util.converter.LocalDateConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class SampleDispatchHandler {
    private final SampleManifestRepository sampleManifestRepository;
    private final SampleManifestMapper sampleManifestMapper;
    private final PersonRepository personRepository;
    private final PatientRepository patientRepository;
    private final LocalDateConverter localDateConverter = new LocalDateConverter();

    private ObjectMapper mapper = new ObjectMapper();

    @Value("${lims.api.sample.order}")
    private String endpoint;

    public void dispatch()  {
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        //Retrieve manifest ID of all sample manifest not yet dispatched
        List<String> manifestIds = sampleManifestRepository.findManifestsDistinct(false);
        if(manifestIds.size() > 0) {
            manifestIds.forEach(this::dispatcher);
        }
    }

    private void dispatcher(String manifestId) {
        List<ViralLoadSampleInformation> sampleInformations = new ArrayList<>();
        final ViralLoadSampleInformation[] sampleInformation = {new ViralLoadSampleInformation()};

        // Retrieve all sample information from manifest and dispatch
        List<SampleManifest> sampleManifests = sampleManifestRepository.findSampleManifestsByManifestId(manifestId);
        if (sampleManifests.size() > 0) {
            sampleManifests.forEach( sampleManifest -> {
                System.out.println(sampleManifest.getManifestId());
                //Retrieve the sample information for this manifest
                Optional<Person> person = personRepository.findById(sampleManifest.getClientId());
                if(person.isPresent()){
                    sampleInformation[0] = sampleManifestMapper.toViralLoadSampleInformation(sampleManifest, person.get());
                    sampleInformation[0].setPatientID(getIdentifiers(sampleManifest.getClientId()));
                    sampleInformation[0].setSex(CodeSetResolver.getSexCode(person.get().getGenderId()));
                    int age  = Period.between(person.get().getDob(), LocalDate.now()).getYears();
                    sampleInformation[0].setAge(age);

                    sampleInformation[0].setSampleType("WB");
                    sampleInformation[0].setSampleCollectionTime(localDateConverter.convertToTimeStamp(sampleManifest.getDateSampleCollected(), sampleManifest.getTimeSampleCollected()));
                    sampleInformation[0].setIndicationVLTest(CodeSetResolver.getVlCode(sampleManifest.getViralLoadIndication()));
                    sampleInformation[0].setPregnantBreastFeedingStatus("p");
                    sampleInformation[0].setArtCommencementDate(new Date());
                    sampleInformation[0].setDrugRegimen("1a");
                    sampleInformations.add(sampleInformation[0]);
                }
            });
            // Create a manifest object from the sample dispatch manifest
            ViralLoadManifest manifest = sampleManifestMapper.toViralLoadManifest(sampleManifests.get(0));
            System.out.println(manifest.getManifestID());
            // Set the sample information on the manifest
            manifest.setSampleInformation(sampleInformations);
            Container container = new Container();
            container.setViralLoadManifest(manifest);

            System.out.println(endpoint);
            try {
                // Convert object to JSON string
                String samples = mapper.writeValueAsString(container);
                System.out.println(samples);
                new HttpConnectionManager().post(samples, endpoint);
                sampleManifestRepository.flagManifestAsDispatched(manifest.getManifestID());
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    private List<PatientID> getIdentifiers(Long clientId) {
        List<PatientID> patientIds = new ArrayList<>();
        // get hospital number
        PatientID patientId = new PatientID();
        Optional<Patient> patient = patientRepository.findById(clientId);
        if(patient.isPresent()) {
            patientId.setIdNumber(patient.get().getHospitalNumber());
            patientId.setIdTypeCode("HOSPITALNO");
            patientIds.add(patientId);
        }
        // get unique id
        // get recency number
        return  patientIds;
    }
}
