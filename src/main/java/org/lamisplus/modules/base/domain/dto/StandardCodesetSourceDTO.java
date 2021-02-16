package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
public class StandardCodesetSourceDTO {
    private Long id;

    private String name;

    private String description;
}
