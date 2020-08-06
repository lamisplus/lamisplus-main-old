package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.lamisplus.modules.base.extension.lims.PatientIdDTO;

import java.util.Date;
import java.util.List;

@Data
public class TestResult {
    private String firstName;
    private String surName;
    private String sex;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateOfBirth;
    private String sampleID;
    private String pcrLabSampleNumber;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date visitDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateSampleReceivedAtPCRLab;
    private String testResult;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date resultDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date assayDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date approvalDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateResultDispatched;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Integer sampleStatus;
    private Boolean sampleTestable;

    private List<PatientIdDTO> patientId;
}
