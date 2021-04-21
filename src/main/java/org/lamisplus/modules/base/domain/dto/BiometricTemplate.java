package org.lamisplus.modules.base.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BiometricTemplate {
    private byte[] template;
    private Long clientId;

}
