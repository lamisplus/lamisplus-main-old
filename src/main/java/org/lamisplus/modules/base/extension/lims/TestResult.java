package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TestResult implements Serializable {
    private String firstName;
    private String lastName;
    private String sex;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateOfBirth;
    private String sampleID;
    private String pcrLabSampleNumber;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date visitDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateSampleRecievedAtPCRLab;
    private String testResult;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date resultDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date assayDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date approvalDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateResultDispatched;
    private String sampleStatus;
    private Boolean sampleTestable;

    private List<PatientID> patientID;
}
