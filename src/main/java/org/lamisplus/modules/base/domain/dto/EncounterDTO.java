package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.lamisplus.modules.base.domain.entity.FormData;
import org.lamisplus.modules.base.util.converter.LocalDateConverter;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.Convert;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private int formType = 0;

    private String firstName;
    private String lastName;
    @Convert(converter = LocalDateConverter.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;
    private String patientNumberType;
    private String hospitalNumber;
    private String formName;
    private Integer typePatient = 0;
    private List<Object> data;
    private List<Object> formDataObj;
    private Object details;
    private Long organisationUnitId;
    private String patientUuid;
    private String visitUuid;
    private String createdBy;
    private String modifiedBy;
    private String uuid;
    private LocalDateTime dateModified;
    private Integer archived;
    private LocalDateTime dateCreated;

}
