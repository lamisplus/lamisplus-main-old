package org.lamisplus.modules.base.base.domain.dto;


import lombok.Data;

@Data
public class ApplicationCodesetDTO {
    private Long id;

    private String codesetGroup;

    private String version;

    private String language;

    private String display;

    private Integer active;

    private String code;

}
