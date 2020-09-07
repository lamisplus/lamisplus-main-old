package org.lamisplus.modules.base.extension.lims;

import lombok.Value;

import java.time.LocalDate;
import java.time.LocalTime;

@Value
public class ManifestDTO {
    String manifestId;
    String sendingFacilityId ;
    String sendingFacilityName;
    String receivingLabId;
    String receivingLabName;

    String courierName;
    String courierPhoneNumber;
    Integer totalSampleShipment;

    String sampleDispatchedBy;
    LocalDate dateSampleDispatched;
    LocalTime timeSampleDispatched;
}

