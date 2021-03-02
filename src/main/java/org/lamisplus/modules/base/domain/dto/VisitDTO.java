package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.lamisplus.modules.base.util.converter.LocalDateConverter;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.Convert;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Data
public class VisitDTO {

    private Long id;
    private Long personId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate dateVisitEnd;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate dateVisitStart;

    @Convert(converter = LocalTimeAttributeConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    private LocalTime timeVisitEnd;

    @Convert(converter = LocalTimeAttributeConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    private LocalTime timeVisitStart;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate dateNextAppointment;

    private Integer typePatient;

    private Long patientId;

    private Long visitTypeId;

    //PATIENT PERSONAL DETAILS
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate dateRegistration;
    private String hospitalNumber;
    private String firstName;
    private String lastName;
    private String otherNames;
    private Long maritalStatusId;
    private Long titleId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate dob;
    private Long genderId;
    private Long educationId;
    private Long occupationId;
    private List<AppointmentDTO> appointmentDTOList;
}
