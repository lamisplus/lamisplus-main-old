package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientList {
    private Long patientId;
    private Long personId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateRegistration;

    private String patientNumber;
    private String firstName;
    private String lastName;
    private String otherNames;
    private String maritalStatus;
    private String title;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dob;
    private Boolean dobEstimated;
    private Integer age;
    private String gender;
    private String education;
    private String occupation;
    private String facility;
    private String mobilePhoneNumber;
    private String alternatePhoneNumber;
    private String email;
    private String zipCode;
    private String city;
    private String street;
    private String landmark;
    private String country;
    private String state;
    private String province;
    private String address;
    private String phone;

    private String statusRegistration;
    private String currentStatus;
    private String lastViralLoad;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateStarted;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateCurrentStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateLastViralLoad;

}

