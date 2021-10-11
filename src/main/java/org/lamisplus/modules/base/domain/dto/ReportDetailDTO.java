package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.Parameter;

import java.io.Serializable;
import java.util.List;

@Data
public class ReportDetailDTO implements Serializable {
    private Long reportId;
    private String reportType;
    private List<Parameter> parameters;
}
