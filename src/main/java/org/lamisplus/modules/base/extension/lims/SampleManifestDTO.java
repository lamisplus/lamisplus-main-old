package org.lamisplus.modules.base.extension.lims;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.lamisplus.modules.base.util.converter.LocalTimeAttributeConverter;

import javax.persistence.Convert;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SampleManifestDTO implements Serializable {
    private Long id;
    private String manifestId;
    private Long clientId;
    private String sendingFacilityId ;
    private String sendingFacilityName;
    private String receivingLabId;
    private String receivingLabName;
    private String labNumber;
    private String sampleType;
    private String viralLoadIndication;
    private String sampleOrderedBy;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateSampleOrdered;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeSampleOrdered;

    private String labOrderPriority;
    private String sampleCollectedBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateSampleCollected;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeSampleCollected;
    private String sampleTransferredBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateSampleTransferred;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeSampleTransferred;
    private String sampleDispatchedBy;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateSampleDispatched;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @Convert(converter = LocalTimeAttributeConverter.class)
    private LocalTime timeSampleDispatched;
    private String courierName;
    private String courierPhoneNumber;
    private Integer totalSampleShipment;
    private Boolean dispatched;

    private String pcrLabSampleNumber;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate visitDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateSampleReceivedLab;
    private String testResult;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateResultReported;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateAssayed;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateApproved;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateResultDispatched;
    private String sampleStatus;
    private Boolean sampleTestable;

}
