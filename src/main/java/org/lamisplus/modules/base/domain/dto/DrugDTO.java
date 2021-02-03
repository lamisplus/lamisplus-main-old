package org.lamisplus.modules.base.domain.dto;

import lombok.Data;


@Data
public class DrugDTO {

    private Long id;

    private String name;

    private String code;

    private Long drugGroupId;
}
