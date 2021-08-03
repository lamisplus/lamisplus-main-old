package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.lamisplus.modules.base.domain.entity.Audit;
import org.lamisplus.modules.base.domain.entity.PatientFlag;

import javax.persistence.*;
import java.util.List;


@Data
public class FlagDTO {

    private Long id;

    private String name;

    private String fieldName;

    private String fieldValue;

    private Integer datatype;

    private String operand;
}