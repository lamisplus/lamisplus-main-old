package org.lamisplus.modules.base.extension.lims;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

public class TestResultProcessor {
    private final SampleManifestRepository sampleManifestRepository;

    public TestResultProcessor(SampleManifestRepository sampleManifestRepository) {
        this.sampleManifestRepository = sampleManifestRepository;
    }

    public void process(List<TestResultResponse> testResultResponses) {
        if (testResultResponses.size() > 0) {
            testResultResponses.forEach(testResult ->  {
                List<ViralLoadTestReport> viralLoadTestReports = testResult.getViralLoadTestReport();
                if(viralLoadTestReports.size() > 0) {
                    viralLoadTestReports.forEach(viralLoadTestReport -> {
                        //Retrieve sample information from manifest
                        //Add test result and persist in database
                        int i = 0;
                        String id = viralLoadTestReport.getSampleID();
                        Optional<SampleManifest> sampleManifest = sampleManifestRepository.findById(Long.valueOf(id));
                        if(sampleManifest.isPresent()) {
                            sampleManifest.get().setId((long) i++);
                            sampleManifest.get().setTestResult(viralLoadTestReport.getTestResult());
                            sampleManifest.get().setDateResultReported(LocalDate.parse(viralLoadTestReport.getResultDate()));
                            sampleManifest.get().setDateApproved(LocalDate.parse(viralLoadTestReport.getApprovalDate()));
                            sampleManifest.get().setDateAssayed(LocalDate.parse(viralLoadTestReport.getAssayDate()));
                            sampleManifest.get().setDateSampleReceivedLab(LocalDate.parse(viralLoadTestReport.getDateSampleRecievedAtPCRLab()));
                            sampleManifest.get().setDateAssayed(LocalDate.parse(viralLoadTestReport.getAssayDate()));
                            sampleManifest.get().setSampleStatus(viralLoadTestReport.getSampleStatus());
                            boolean sampleTestable = viralLoadTestReport.getSampleTestable().equals("true");
                            sampleManifest.get().setSampleTestable(sampleTestable);

                            //Save updated sample information
                            sampleManifestRepository.save(sampleManifest.get());
                        }
                    });
                }
            });
        }
    }
}
