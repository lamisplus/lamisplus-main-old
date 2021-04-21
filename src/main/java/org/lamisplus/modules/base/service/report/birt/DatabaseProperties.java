package org.lamisplus.modules.base.service.report.birt;


import lombok.Data;

import java.util.Map;

@Data
public class DatabaseProperties {
    private Map<String, DataSource> spring;
}
