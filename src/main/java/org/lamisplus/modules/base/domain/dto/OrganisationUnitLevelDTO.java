package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Data
public class OrganisationUnitLevelDTO {

    private Long id;

    private String name;

    private String description;
}
