package org.lamisplus.modules.base.service;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import java.io.IOException;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationCodeSet;
import org.lamisplus.modules.base.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;
import static org.assertj.core.api.Assertions.assertThat;

@Profile("test")
@RunWith(SpringRunner.class)
@SpringBootTest(classes= BaseApplication.class)
public class ApplicationCodesetUnitTest {

    @Autowired
    private ApplicationCodeSetService appCodesetService;

    // MockBean is the annotation provided by Spring that wraps mockito one
    // Annotation that can be used to add mocks to a Spring ApplicationContext.
    // If any existing single bean of the same type defined in the context will be replaced by the mock, if no existing bean is defined a new one will be added.
    @MockBean
    private RestTemplate template;
    @Test
    public void testGetApplicationCodeset() throws IOException {
        // Parsing mock file
        ApplicationCodeSet applicationCodesets = JsonUtils.jsonFile2Object("appCodeSet.json", ApplicationCodeSet.class);
        // Mocking remote service
        when(template.getForEntity(any(String.class), any(Class.class))).thenReturn(new ResponseEntity(applicationCodesets, HttpStatus.OK));

        List<ApplicationCodesetDTO> applicationCodesetList = appCodesetService.getApplicationCodeByCodeSetGroup("GENDER");
        if(applicationCodesetList == null){
            System.out.println("List is null");
        } else {
            System.out.println("List is not null");

        }
        assertThat(applicationCodesetList).isNotNull()
                .isNotEmpty()
                .allMatch(codeset -> codeset.getLanguage()
                        .toLowerCase()
                        .contains("en"));
    }
}