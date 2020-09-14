package org.lamisplus.modules.base.extension.lims;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Data
public class EidSampleInformation implements Serializable {
    private String firstName;
    private String surName;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateOfBirth;
    private Integer ageInMonths;
    private String sex;

    private String sampleID;
    private String sampleType;
    private String sampleOrderedBy;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date sampleOrderDate;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date sampleCollectionDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS", timezone="UTC")
    private LocalTime sampleCollectionTime;
    private String sampleCollectedBy;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dateSampleSent;

    private Integer reasonForPCR;
    private Integer rapidTestDone;
    private Integer artAdministeredToMother;
    private Integer babyReceived;
    private String babyEverBreastFed;
    private String babyBreastFeedingNow;
    private String cotrimoxazoleGiven;

    private List<PatientID> patientId;
}
