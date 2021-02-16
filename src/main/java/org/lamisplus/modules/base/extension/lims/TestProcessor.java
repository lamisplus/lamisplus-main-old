package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.ArrayList;
import java.util.List;

public class TestProcessor {
    private final SampleManifestRepository sampleManifestRepository;

    public TestProcessor(SampleManifestRepository sampleManifestRepository) {
        this.sampleManifestRepository = sampleManifestRepository;
    }

    public void TestResult() {
    }

    public void test() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            mapper.enable(SerializationFeature.INDENT_OUTPUT);

            List<TestResultResponse> testResultResponses = new ArrayList<>();
            String response = "{\"manifestID\":\"CR10000005\",\"receivingFacilityID\":\"GW1w1chZMPR\",\"receivingFacilityName\":\"University of Abuja Teaching Hospital Gwagwalada\",\"sendingPCRLabID\":\"LIMS150002\",\"sendingPCRLabName\":\"NRL Abuja\",\"testType\":\"VL\",\"viralLoadTestReport\": [{\"patientID\": [{\"idNumber\":\"\",\"idTypeCode\":\"RECENCY\"},{\"idNumber\":\"233H45\",\"idTypeCode\":\"HOSPITALNO\"},{\"idNumber\":\"\",\"idTypeCode\":\"CLIENTID\"}],\"firstName\":\"Blessing\",\"lastName\":\"Agada\",\"sex\":\"\",\"dateOfBirth\":\"0000-00-00\",\"sampleID\":\"CHEM0946\",\"pcrLabSampleNumber\":\"ATLC/UATH/20/1001\",\"visitDate\":\"2020-06-10\",\"dateSampleRecievedAtPCRLab\":\"2020-08-07\",\"testResult\":\"567432\",\"resultDate\":\"2020-02-01\",\"assayDate\":\"2020-02-01\",\"approvalDate\":\"2020-08-07\",\"dateResultDispatched\":\"2020-08-23\",\"sampleStatus\":\"3\",\"sampleTestable\":\"true\"},{\"patientID\": [{\"idNumber\":\"\",\"idTypeCode\":\"RECENCY\"},{\"idNumber\":\"COM0123\",\"idTypeCode\":\"HOSPITALNO\"},{\"idNumber\":\"\",\"idTypeCode\":\"CLIENTID\"}],\"firstName\":\"Chioma\",\"lastName\":\"Nwoha\",\"sex\":\"\",\"dateOfBirth\":\"0000-00-00\",\"sampleID\":\"CHEM0946\",\"pcrLabSampleNumber\":\"ATLC/UATH/20/1002\",\"visitDate\":\"2020-07-07\",\"dateSampleRecievedAtPCRLab\":\"2020-08-07\",\"testResult\":\"879234\",\"resultDate\":\"2020-02-01\",\"assayDate\":\"2020-02-01\",\"approvalDate\":\"2020-08-07\",\"dateResultDispatched\":\"2020-08-23\",\"sampleStatus\":\"3\",\"sampleTestable\":\"true\"},{\"patientID\": [{\"idNumber\":\"\",\"idTypeCode\":\"RECENCY\"},{\"idNumber\":\"twsg1234\",\"idTypeCode\":\"HOSPITALNO\"},{\"idNumber\":\"\",\"idTypeCode\":\"CLIENTID\"}],\"firstName\":\"Josephine\",\"lastName\":\"Uche\",\"sex\":\"\",\"dateOfBirth\":\"0000-00-00\",\"sampleID\":\"CHEM0946\",\"pcrLabSampleNumber\":\"ATLC/UATH/20/1003\",\"visitDate\":\"2020-07-10\",\"dateSampleRecievedAtPCRLab\":\"2020-08-07\",\"testResult\":\"45678\",\"resultDate\":\"2020-02-01\",\"assayDate\":\"2020-02-01\",\"approvalDate\":\"2020-08-07\",\"dateResultDispatched\":\"2020-08-23\",\"sampleStatus\":\"3\",\"sampleTestable\":\"true\"},{\"patientID\": [{\"idNumber\":\"\",\"idTypeCode\":\"RECENCY\"},{\"idNumber\":\"101010\",\"idTypeCode\":\"HOSPITALNO\"},{\"idNumber\":\"\",\"idTypeCode\":\"CLIENTID\"}],\"firstName\":\"Christain\",\"lastName\":\"Peter\",\"sex\":\"\",\"dateOfBirth\":\"0000-00-00\",\"sampleID\":\"CHEM0946\",\"pcrLabSampleNumber\":\"ATLC/UATH/20/1004\",\"visitDate\":\"2020-06-17\",\"dateSampleRecievedAtPCRLab\":\"2020-08-07\",\"testResult\":\"643987\",\"resultDate\":\"2020-02-01\",\"assayDate\":\"2020-02-01\",\"approvalDate\":\"2020-08-07\",\"dateResultDispatched\":\"2020-08-23\",\"sampleStatus\":\"3\",\"sampleTestable\":\"true\"},{\"patientID\": [{\"idNumber\":\"\",\"idTypeCode\":\"RECENCY\"},{\"idNumber\":\"H0055\",\"idTypeCode\":\"HOSPITALNO\"},{\"idNumber\":\"\",\"idTypeCode\":\"CLIENTID\"}],\"firstName\":\"Adamu\",\"lastName\":\"Ahamed\",\"sex\":\"\",\"dateOfBirth\":\"0000-00-00\",\"sampleID\":\"CHEM0946\",\"pcrLabSampleNumber\":\"ATLC/UATH/20/1005\",\"visitDate\":\"2020-07-07\",\"dateSampleRecievedAtPCRLab\":\"2020-08-07\",\"testResult\":\"193523\",\"resultDate\":\"2020-02-01\",\"assayDate\":\"2020-02-01\",\"approvalDate\":\"2020-08-07\",\"dateResultDispatched\":\"2020-08-23\",\"sampleStatus\":\"3\",\"sampleTestable\":\"true\"}]}\n";
            System.out.println(response);
            TestResultResponse testResultResponse = mapper.readValue(response, TestResultResponse.class);
            testResultResponses.add(testResultResponse);
            new TestResultProcessor(this.sampleManifestRepository).process(testResultResponses);
        }
        catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
