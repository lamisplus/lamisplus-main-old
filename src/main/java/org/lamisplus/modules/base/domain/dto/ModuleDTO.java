package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

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

    private Timestamp dateInstalled;

    private String installedBy;

    private Timestamp dateModified;

    private String modifiedBy;

    private String status;

    private Integer moduleType;
}
