package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.DataSourceDTO;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DataSourceService {

    public List<DataSourceDTO> getAllDataSources() {
        List<DataSourceDTO> dataSourceDTOS = new ArrayList<>();
        DataSourceDTO dataSourceDTO = new DataSourceDTO();
        dataSourceDTOS.add(dataSourceDTO);
        return  dataSourceDTOS;
    }

    public DataSourceDTO getData(String format) {
        DataSourceDTO dataSourceDTO = new DataSourceDTO();
        return dataSourceDTO;
    }
}
