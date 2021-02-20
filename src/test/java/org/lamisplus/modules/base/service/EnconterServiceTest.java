package org.lamisplus.modules.base.service;


import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.EncounterDTO;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.repository.EncounterRepository;
import org.lamisplus.modules.base.util.JsonUtils;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Profile("test")
@RunWith(SpringRunner.class)
@SpringBootTest(classes= BaseApplication.class)
public class EnconterServiceTest {



    @Autowired
    private EncounterService encounterService;

    @MockBean
    private EncounterRepository encounterRepository;

    @Before
    public void setUp() {
        Path path = Paths.get("src","main", "resources","test", "encounter.json");
        List<Encounter> encounters =  JsonUtils.readJsonFile(new Encounter(), path.toString());
        List<EncounterDTO> encounterDTOS =  JsonUtils.readJsonFile(new EncounterDTO(), path.toString());


        Mockito.when(encounterRepository.findAll()).thenReturn(encounters);
        //Mockito.when(encounterRepository.findByPatientIdAndProgramCodeAndFormCodeAndDateEncounter(1L, "wrong_program_code", "invalid_form_name", LocalDate.now())).thenReturn(null);

        Mockito.when(encounterService.getAllEncounters()).thenReturn(null);

    }


    public Encounter getSingleEncounter(Long id){
        Path path = Paths.get("src","main", "resources","test", "encounter.json");
        List<Encounter> encounters =  JsonUtils.readJsonFile(new Encounter(), path.toString());
        Encounter encounter1 = null;
        for (Encounter encounter : encounters) {
            if (encounter.getId() == id) {
                encounter1 = encounter;
                break;
            }
        }
        return encounter1;

    }

    @Test
    @DisplayName("getEncounterTest_display_error_message")
    public void getEncounterTest() {
        Long id = -99L;
        assertEquals(encounterService.getEncounter(50L), getSingleEncounter(50L));
        Throwable thrown = assertThrows(EntityNotFoundException.class, () -> encounterService.getEncounter(id));
        assertThat(thrown.getMessage(), is("Encounter was not found for parameters {Id="+id+"}"));
    }

    @Test
    @DisplayName("updateTest_returns_updated_encounter")
    public void updateTest() {
        Long id = -99L;
        Throwable thrown = assertThrows(EntityNotFoundException.class, () -> encounterService.getEncounter(id));
        assertThat(thrown.getMessage(), is("Encounter was not found for parameters {Id="+id+"}"));
    }

    @MockBean
    private RestTemplate template;
    @Test
    public void getAllEncountersTest() throws IOException {
        Path path = Paths.get("src","main", "resources","test", "encounter.json");
        List<Encounter> encountersDTOList =  JsonUtils.readJsonFile(new EncounterDTO(), path.toString());

        // Mocking remote service
        when(template.getForEntity(any(String.class), any(Class.class))).thenReturn(new ResponseEntity(encountersDTOList, HttpStatus.OK));

        List<EncounterDTO> encounterDTOS = encounterService.getAllEncounters();
        if(encounterDTOS == null && encounterDTOS.size() > 0){
            System.out.println("List is null");
        } else {
            System.out.println("List is not null");

        }
        Assertions.assertThat(encounterDTOS).isNotNull()
                .isNotEmpty()
                .allMatch(encounterDTO -> encounterDTO.getProgramCode() != null);
    }

}
