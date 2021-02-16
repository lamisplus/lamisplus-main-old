package org.lamisplus.modules.base.extension.lims;

import lombok.Data;
import java.util.List;

@Data
public class ViralLoadTestReport {
    public List<PatientID> patientID;
    public String firstName;
    public String lastName;
    public String sex;
    public String dateOfBirth;
    public String sampleID;
    public String pcrLabSampleNumber;
    public String visitDate;
    public String dateSampleRecievedAtPCRLab;
    public String testResult;
    public String resultDate;
    public String assayDate;
    public String approvalDate;
    public String dateResultDispatched;
    public String sampleStatus;
    public String sampleTestable;
}
