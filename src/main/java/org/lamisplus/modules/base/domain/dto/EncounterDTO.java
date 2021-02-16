package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.util.converter.LocalDateConverter;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.Convert;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EncounterDTO implements Serializable {
    private Long encounterId;
    @JsonIgnore
    private Long personId;
    @JsonIgnore
    private Long formId;

    private String formCode;

    private String programCode;

    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateEncounter;
    private Long patientId;
    private Long visitId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeCreated;
    private String FirstName;
    private String LastName;

    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dob;
    private String OtherNames;
    private String hospitalNumber;
    private String formName;
    private Integer typePatient;
    private List<Object> data;
    private List<Object> formDataObj;
}
