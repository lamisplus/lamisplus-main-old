package org.lamisplus.modules.base.controller;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.DHISDataelementDTO;
import org.lamisplus.modules.base.domain.dto.DHISDatasetDTO;
import org.lamisplus.modules.base.domain.dto.DHISDatavalueDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.lamisplus.modules.base.domain.dto.DHISInstanceDTO;
import org.lamisplus.modules.base.domain.entity.DHISInstance;
import org.lamisplus.modules.base.services.DHISServices;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class DHISController {
    private final String ENTITY_NAME = "DHIS";

    private final  DHISServices dhisServices;

    @RequestMapping("/api/dhis")
    public ResponseEntity<List<DHISInstanceDTO>> getAllPatients() {
        return ResponseEntity.ok(dhisServices.getAllInstances());
    }

    //@RequestMapping(method = RequestMethod.POST, value = "/dhisinstance")
    @PostMapping("/api/dhis/instances")
    public String addInstance(@RequestBody DHISInstanceDTO dhisInstanceDTO){
        return dhisServices.addDHISInstance(dhisInstanceDTO);
    }
    @RequestMapping("/api/dhis/datasets")
    public ResponseEntity<List<DHISDatasetDTO>> getAllDatasets() {
        return ResponseEntity.ok(dhisServices.getAllDatasets());
    }
    @PostMapping("/api/dhis/datasets/{dhisId}")
    public String addDataset(@PathVariable String dhisId, @RequestBody DHISDatasetDTO datasetDTO){
        return dhisServices.addDataset(dhisId,datasetDTO);
    }

    @RequestMapping("/api/dhis/dataelements/{datasetId}")
    public List<DHISDataelementDTO> getDatasetElements(@PathVariable String datasetId){
        return dhisServices.getDatasetElements(datasetId);
    }

    @PostMapping("/api/dhis/dataelements/{datasetId}")
    public String addDataelement(@PathVariable String datasetId, @RequestBody DHISDataelementDTO dataelementDTO){
        return dhisServices.addDataelement(datasetId, dataelementDTO);
    }

    @RequestMapping("/api/dhis/datasetvalue/{datasetId}")
    public List<DHISDatavalueDTO> getDatasetValues(@PathVariable String datasetId){
        return dhisServices.getDatasetValues(datasetId);
    }
}