package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class ApplicationCodesetResponseDTO {
    private Long id;

    private String display;

    private String code;

    public ApplicationCodesetResponseDTO(Long id, String display, String code){
        this.id = id;
        this.display = display;
        this.code = code;
    }
}
