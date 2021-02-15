package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.DataSourceDTO;
import org.lamisplus.modules.base.domain.entity.DataSource;
import org.lamisplus.modules.base.repository.DataSourceRepository;
import org.lamisplus.modules.base.service.DataSourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/data-sources")
@Slf4j
@RequiredArgsConstructor
@Audit
public class DataSourceController {
    private final DataSourceService dataSourceService;
    private final DataSourceRepository dataSourceRepository;

    private static final String ENTITY_NAME = "DataSource";

    @GetMapping
    public ResponseEntity<List<DataSource>> getDataSources() {
        List<DataSource>  dataSources = dataSourceRepository.findAll();
        return ResponseEntity.ok(dataSources);
    }

    @GetMapping("/{format}")
    public ResponseEntity<DataSourceDTO> getData(@PathVariable String format) {
        DataSourceDTO  dataSourceDTO = dataSourceService.getData(format);
        return ResponseEntity.ok(dataSourceDTO);
    }

}
