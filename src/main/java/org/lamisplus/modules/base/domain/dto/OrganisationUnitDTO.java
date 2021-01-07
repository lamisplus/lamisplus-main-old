package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitHierarchy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data

public class OrganisationUnitDTO {

    private Long id;

    private String name;

    private String description;

    private Long organisationUnitLevelId;

    private Long parentOrganisationUnitId;
}
