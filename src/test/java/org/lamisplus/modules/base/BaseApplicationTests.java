package org.lamisplus.modules.base;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.lamisplus.modules.base.BaseApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = BaseApplication.class)
class BaseApplicationTests {
	@Autowired
	private MockMvc mvc;

	@Test
	public void whenRequestThymeleaf_thenStatusOk() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/patient")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

}
