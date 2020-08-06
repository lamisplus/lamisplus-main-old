package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ModuleDTO {

    private Long id;

    private Boolean active;

    private String artifact_id;

    private String basePackage;

    private String description;

    private String name;

    private String version;

    private String uuid;

    private Timestamp dateCreated;

    private String createdBy;

    private Timestamp dateModified;

    private String modifiedBy;

    private Integer moduleType;
}
