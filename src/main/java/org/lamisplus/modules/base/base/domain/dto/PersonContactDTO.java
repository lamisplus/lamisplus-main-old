package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;

@Data
public class PersonContactDTO {
    private Long id;
    private String mobilePhoneNumber;
    private String alternatePhoneNumber;
    private String email;
    private String zipCode;
    private String city;
    private String street;
    private String landmark;
    private Long countryId;
    private Long stateId;
    private Long provinceId;
    private Long personId;
}
