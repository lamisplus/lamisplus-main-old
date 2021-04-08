package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class BiometricResult {
        private Long id;
        private String message;
        private byte[] template;
        private boolean identified;
    }

