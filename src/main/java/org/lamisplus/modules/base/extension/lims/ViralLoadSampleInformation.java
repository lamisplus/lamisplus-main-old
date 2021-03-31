package org.lamisplus.modules.base.extension.lims;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class ViralLoadSampleInformation implements Serializable  {
    private String firstName;
    private String surName;
    private String sex;
    private Integer age;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateOfBirth;

    private String sampleID;
    private String sampleType;
    private String sampleOrderedBy;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date sampleOrderDate;
    private String sampleCollectedBy;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date sampleCollectionDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS", timezone="UTC")
    private Date sampleCollectionTime;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateSampleSent;

    private Integer indicationVLTest;
    private String pregnantBreastFeedingStatus;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date artCommencementDate;
    private String drugRegimen;

    private List<PatientID> patientID;

}
