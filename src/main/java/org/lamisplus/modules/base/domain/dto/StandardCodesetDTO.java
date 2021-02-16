package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.lamisplus.modules.base.domain.entity.ApplicationCodesetStandardCodeset;

import javax.persistence.*;
import java.util.List;

@Data
public class StandardCodesetDTO {

    private Long id;

    private String code;

    private String description;

    private Long standardCodesetSourceId;

}
