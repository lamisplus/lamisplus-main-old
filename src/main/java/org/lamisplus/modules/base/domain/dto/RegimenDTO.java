package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.lamisplus.modules.base.domain.entity.Audit;
import org.lamisplus.modules.base.domain.entity.RegimenDrug;
import org.lamisplus.modules.base.domain.entity.RegimenLine;

import javax.persistence.*;
import java.util.List;

@Data
public class RegimenDTO {

    private Long id;

    private String name;

    private Long regimenLineId;
}
