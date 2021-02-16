package org.lamisplus.modules.base.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


import com.fasterxml.jackson.databind.type.CollectionType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.repository.EncounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Value;
import org.lamisplus.modules.base.domain.dto.EncounterDTO;
import org.lamisplus.modules.base.domain.entity.Encounter;
import org.lamisplus.modules.base.domain.mapper.EncounterMapper;
import org.lamisplus.modules.base.security.jwt.TokenProvider;
import org.lamisplus.modules.base.service.EncounterService;
import org.lamisplus.modules.base.util.LoadJson;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RunWith(SpringRunner.class)
@WebMvcTest(EncounterController.class)
@AutoConfigureMockMvc
@ActiveProfiles(value = "test")
public class EncounterControllerTest {
    @MockBean
    EncounterService encounterService;

    @MockBean
    List<Encounter> encounters;

    @MockBean
    EncounterRepository encounterRepository;

    @MockBean
    Encounter encounter;

    ObjectMapper mapper = new ObjectMapper();


    @Value("${jwt.token}")
    private String jwtToken;

    @Autowired
    private WebApplicationContext webApplicationContext;


    private MockMvc mockMvc;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        /*Path path = Paths.get("src","test", "java", "resource", "encounter.json");
        readJsonFile(new EncounterDTO(), path.toString()).forEach(encounter1 -> {
            encounterService.save((EncounterDTO) encounter1);
        });*/

    }

    public List readJsonFile(Object obj, String jsonFile){
        ObjectMapper objectMapper = new ObjectMapper();
        List entityObject = null;
        InputStream input;
        objectMapper. configure(DeserializationFeature. FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            input = new FileInputStream(jsonFile);

            CollectionType javaType = objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, obj.getClass());

            entityObject = objectMapper.readValue(input, javaType);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return entityObject;
    }


    @Test
    public void saveEncounterTest() {
        Path path = Paths.get("src","test", "java", "resource", "encounter.json");
        //TODO: Set the encounterDTO


        readJsonFile(new Encounter(), path.toString()).forEach(encounter1 -> {
            Encounter encounter = (Encounter) encounter1;
            System.out.println(encounter1);
            when(encounterService.save(any(EncounterDTO.class))).thenReturn(encounter);

            /*try {
                mockMvc.perform(post("/api/encounters")
                        .with(csrf())
                        .header("Authorization", "Bearer " + jwtToken)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(encounter1))
                        .contentType(MediaType.APPLICATION_JSON))
                        .andDo(print())
                        .andExpect(status().isCreated())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
            } catch (Exception e) {
                e.printStackTrace();
            }*/
        });
        }

    @Test
    public void getAllEncountersTest() throws Exception {
        Path path = Paths.get("src","test", "java", "resource", "encounter.json");

        readJsonFile(new Encounter(), path.toString()).forEach(encounter1 -> {
            Encounter encounter = (Encounter) encounter1;
            System.out.println(encounter);
            when(encounterService.save(any(EncounterDTO.class))).thenReturn(encounter);

            try {
                mockMvc.perform(get("/api/encounters").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andDo(print())
                        .andExpect(content().contentType("application/json"))
                        .andExpect(status().isOk())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.visitId").exists())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.encounters[*].id").isNotEmpty());
            } catch (Exception e) {
                e.printStackTrace();
            }

        });

        mockMvc.perform(get("/api/encounters").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andDo(print())
                        .andExpect(content().contentType("application/json"))
                        .andExpect(status().isOk())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.visitId").exists())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.encounters[*].id").isNotEmpty());
    }

    @Test
    public void getEncounterByIdTest() throws Exception
    {
        mockMvc.perform( MockMvcRequestBuilders
                .get("/api/encounters/{id}", 1)
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1));
    }
}
