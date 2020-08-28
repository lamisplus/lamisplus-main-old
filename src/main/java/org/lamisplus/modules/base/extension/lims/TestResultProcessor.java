package org.lamisplus.modules.base.extension.lims;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class TestResultProcessor {
    private SampleManifestRepository sampleManifestRepository;

    public TestResultProcessor(SampleManifestRepository sampleManifestRepository) {
        this.sampleManifestRepository = sampleManifestRepository;
    }

    public void process(List<TestResultResponse> testResultResponses) {
        if (testResultResponses.size() > 0) {
            testResultResponses.forEach(testResult ->  {
                List<ViralLoadTestReport> viralLoadTestReports = testResult.getViralLoadTestReport();
                if(viralLoadTestReports.size() > 0) {
                    viralLoadTestReports.forEach(viralLoadTestReport -> {
                        System.out.println(viralLoadTestReport);
                        //Retrieve sample information from manifest
                        //Add test result and persist in database
                        String id = viralLoadTestReport.getSampleID();
                        Optional<SampleManifest> sampleManifest = this.sampleManifestRepository.findById(Long.valueOf(id));
                        if(sampleManifest.isPresent()) {
                            sampleManifest.get().setTestResult(viralLoadTestReport.getTestResult());
                            sampleManifest.get().setPcrLabSampleNumber(viralLoadTestReport.getPcrLabSampleNumber());
                            sampleManifest.get().setVisitDate(LocalDate.parse(viralLoadTestReport.getVisitDate()));
                            sampleManifest.get().setDateResultReported(LocalDate.parse(viralLoadTestReport.getResultDate()));
                            sampleManifest.get().setDateResultDispatched(LocalDate.parse(viralLoadTestReport.getDateResultDispatched()));
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
