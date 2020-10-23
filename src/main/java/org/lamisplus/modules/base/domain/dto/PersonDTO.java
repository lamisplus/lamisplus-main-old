package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PersonDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String otherNames;
    private Long maritalStatusId = 1L;
    private Long titleId;
    private LocalDate dob;
    private Boolean dobEstimated;
    private Long genderId = 1L;
    private Long educationId = 1L;
    private Long occupationId = 1L;
    private PersonContactDTO personContact;
    private List<PersonRelativesDTO> personRelativeDTOS;
}
