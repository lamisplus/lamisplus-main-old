package org.lamisplus.modules.base.domain.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ReportDetailDTO implements Serializable {
    private Long reportId;
    private List<Parameter> parameters;
}
