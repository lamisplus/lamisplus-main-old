package org.lamisplus.modules.base.service;

import org.hamcrest.MatcherAssert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.PersonContact;
import org.lamisplus.modules.base.domain.mapper.PatientMapper;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.lamisplus.modules.base.util.JsonUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(MockitoJUnitRunner.class)
//@SpringBootTest(classes= BaseApplication.class)
class PatientServiceTest {

    List<Patient> patientListFromRepo, patientList;
    Patient patient1, patient2, patient3;
    Person person1, person2;
    PersonContact personContact1, personContact2;

    @Autowired
    static PatientMapper patientMapper;

    static Timestamp timestamp = new Timestamp(System.currentTimeMillis());

    @InjectMocks
    private PatientService patientService;

    @Mock
    private PatientRepository patientRepository;


    @Before
    void setUp() {
        MockitoAnnotations.initMocks(this);
        patient1 = new Patient();
        System.out.println("Patient Before methods");
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void save() {
    }

    @Test
    void getAllPatientsTest() {
        patient1 = new Patient();
        patient1.setId(1L);
        patient1.setHospitalNumber("Test1");
        patient1.setPersonId(1L);
        //patient1.setFacilityId(200L);

        patient1.setArchived(0);

        patient2 = new Patient();
        patient2.setId(2L);
        patient2.setHospitalNumber("Test2");
        patient2.setPersonId(2L);
        //patient2.setFacilityId(200L);


        patient3 = new Patient();
        patient3.setId(3L);
        patient3.setHospitalNumber("Test3");
        patient3.setPersonId(3L);
        //patient3.setFacilityId(200L);

        System.out.println(patient1);


        patientList = Arrays.asList(patient1, patient2, patient3);

        person1 = new Person();
        person1.setId(2L);
        person1.setDob(timestamp.toLocalDateTime().toLocalDate());
        person1.setDobEstimated(false);
        person1.setFirstName("Stephen");
        person1.setLastName("Ilozue");
        person1.setEducationId(10L);
        person1.setGenderId(12L);
        person1.setOccupationId(19L);
        person1.setMaritalStatusId(13L);
        person1.setPersonTitleId(1L);

        person2 = new Person();
        person2.setId(2L);
        person2.setDob(timestamp.toLocalDateTime().toLocalDate());
        person2.setDobEstimated(false);
        person2.setFirstName("Ogu");
        person2.setLastName("Eze");
        person2.setEducationId(10L);
        person2.setGenderId(12L);
        person2.setOccupationId(19L);
        person2.setMaritalStatusId(13L);
        person2.setPersonTitleId(1L);


        personContact1 = new PersonContact();
        personContact1.setId(1L);
        personContact1.setMobilePhoneNumber("09087654321");
        personContact1.setZipCode("908097");
        personContact1.setCity("Victoria");
        personContact1.setStreet("Crescent");
        personContact1.setLandmark("white building");
        personContact1.setCountryId(1L);
        personContact1.setStateId(1L);
        personContact1.setProvinceId(1L);
        personContact1.setPersonId(1L);


        personContact2 = new PersonContact();
        personContact2.setId(2L);
        personContact2.setMobilePhoneNumber("09087654321");
        personContact2.setZipCode("908097");
        personContact2.setCity("Victoria");
        personContact2.setStreet("Crescent");
        personContact2.setLandmark("white building");
        personContact2.setCountryId(1L);
        personContact2.setStateId(1L);
        personContact2.setProvinceId(1L);
        personContact2.setPersonId(2L);

        PatientDTO patientDTO1 = new PatientDTO();
        patientDTO1 = patientMapper.toPatientDTO(person1, personContact1, patient1);
        PatientDTO patientDTO2 = patientMapper.toPatientDTO(person2, personContact2, patient2);

        List<PatientDTO> patientDTOList = Arrays.asList(patientDTO1, patientDTO2);
        patientList = Arrays.asList(patient1, patient2);

        //patientListFromRepo = patientRepository.findAll();

        System.out.println("patientListFromRepo: " + patientListFromRepo);

        //Mockito.when(patientService.getAllPatients()).thenReturn(patientDTOList);
        assertEquals(patientList.size(), patientDTOList.size());
    }

    @Test
    void getPatientByHospitalNumber() {
    }

    @Test
    void update() {
    }

    @Test
    void getEncountersByPatientIdAndDateEncounter() {
    }

    @Test
    void getAllEncountersByPatientId() {
    }

    @Test
    void getEncountersByPatientIdAndFormCode() {
    }

    @Test
    void getEncountersByPatientIdAndProgramCodeExclusionList() {
    }

    @Test
    void delete() {
    }

    @Test
    void getVisitByPatientIdAndVisitDate() {
    }

    @Test
    void exist() {
    }
}
