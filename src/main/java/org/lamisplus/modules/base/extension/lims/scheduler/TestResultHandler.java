package org.lamisplus.modules.base.extension.lims.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.extension.lims.*;
import org.lamisplus.modules.base.extension.lims.TestResultRequestMapper;
import org.lamisplus.modules.base.util.HttpConnectionManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class TestResultHandler {
    private final SampleManifestRepository sampleManifestRepository;
    private final TestResultRequestMapper testResultRequestMapper;
    private List<TestResultResponse> testResultResponses = new ArrayList<>();
    private ObjectMapper mapper = new ObjectMapper();

    @Value("${lims.api.sample.result}")
    private String endpoint;

    public void retrieve() throws Exception {
        // Create Object Mapper
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        // Retrieve all dispatched manifest with no reported test result
        List<String> manifestIds = sampleManifestRepository.findManifestsDistinct();
        if(manifestIds.size() > 0) {
            manifestIds.forEach(this::retriever);
        }
    }

    private void retriever(String manifestId) {
        System.out.println("Manifest : "+manifestId);
        List<SampleManifest> sampleManifests = sampleManifestRepository.findSampleManifestsByManifestId(manifestId);
        if (sampleManifests.size() > 0) {
            TestResultRequest testResultRequest = testResultRequestMapper.toTestResultRequest(sampleManifests.get(0));
            testResultRequest.setTestType("VL");
            testResultResponses.add(getTestResult(testResultRequest));
        }
        // Process all test result from lims
        new TestResultProcessor(sampleManifestRepository).process(testResultResponses);
    }

    private TestResultResponse getTestResult(TestResultRequest testResultRequest) {
        TestResultResponse testResultResponse = new TestResultResponse();
        try {
            // Convert object to JSON string
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            String json = mapper.writeValueAsString(testResultRequest);
            String response = new HttpConnectionManager().post(json, endpoint);

            System.out.println("Response from server: "+response);
            testResultResponse = mapper.readValue(response, TestResultResponse.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return testResultResponse;
    }
}
