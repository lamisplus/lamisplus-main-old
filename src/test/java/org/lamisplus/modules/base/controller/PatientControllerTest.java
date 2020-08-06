package org.lamisplus.modules.base.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.domain.dto.PatientDTO;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.lamisplus.modules.base.service.PatientService;
import org.lamisplus.modules.base.util.JsonUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Profile("test")
@RunWith(MockitoJUnitRunner.class)
class PatientControllerTest {


    @Mock
    PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    // MockBean is the annotation provided by Spring that wraps mockito one
    // Annotation that can be used to add mocks to a Spring ApplicationContext.
    // If any existing single bean of the same type defined in the context will be replaced by the mock, if no existing bean is defined a new one will be added.
    @MockBean
    private RestTemplate template;

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void getAllPatients() throws IOException {
        // Parsing mock file
        PatientDTO patientDTO = JsonUtils.jsonFile2Object("PatientList.json", PatientDTO.class);
        assertThat(patientDTO).isNotNull();
        // Mocking remote service
        //when(template.getForEntity(any(String.class), any(Class.class))).thenReturn(new ResponseEntity(patientDTO, HttpStatus.OK));

        when(patientService.getAllPatients()).thenReturn((List<PatientDTO>) patientDTO);
        assertEquals(176, patientService.getPatientByHospitalNumber("Test111").getPatientId());

            List<PatientDTO> patientDTOList = patientService.getAllPatients();
            if (patientDTOList == null) {
                System.out.println("List is null");
            } else {
                System.out.println("List is not null");

            }
            assertThat(patientDTOList).isNotNull()
                    .isNotEmpty();

    }


    @Test
    void getPatientByHospitalNumber() {
    }

    @Test
    void exist() {
    }

    @Test
    void save() {
    }

    @Test
    void update() {
    }

    @Test
    void getEncountersByPatientIdAndFormCode() {
    }

    @Test
    void getEncountersByPatientIdAndProgramCodeExclusionList() {
    }

    @Test
    void getVisitByPatientIdAndVisitDate() {
    }

    @Test
    void getEncountersByPatientIdAndDateEncounter() {
    }

    @Test
    void getAllEncounterByPatientId() {
    }

    @Test
    void delete() {
    }
}