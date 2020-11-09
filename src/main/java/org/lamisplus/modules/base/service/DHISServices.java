package org.lamisplus.modules.base.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.DHISDatasetDTO;
import org.lamisplus.modules.base.domain.dto.DHISDatavalueDTO;
import org.lamisplus.modules.base.domain.dto.DHISDataelementDTO;
import org.lamisplus.modules.base.domain.entity.DHISDataset;
import org.lamisplus.modules.base.domain.entity.DHISDatavalue;
import org.lamisplus.modules.base.domain.entity.DHISDataelement;
import org.lamisplus.modules.base.repository.DHISDatasetsRepository;
import org.lamisplus.modules.base.repository.DHISDatavaluesRepository;
import org.lamisplus.modules.base.repository.DHISDataelementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.lamisplus.modules.base.domain.dto.DHISInstanceDTO;
import org.lamisplus.modules.base.domain.entity.DHISInstance;
import org.lamisplus.modules.base.domain.mapper.DHISMapper;
import org.lamisplus.modules.base.repository.DHISInstanceRepository;
import org.apache.commons.lang3.math.NumberUtils;


import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DHISServices {
    private final DHISInstanceRepository dhisInstanceRepository;
    private final DHISDatasetsRepository datasetsRepository;
    private final DHISDataelementRepository dataelementRepository;
    private final DHISDatavaluesRepository datavaluesRepository;
    private final DHISMapper dhisMapper;

    public List<DHISInstanceDTO> getAllInstances(){
        List<DHISInstance> instanceList = dhisInstanceRepository.findAll();
        List<DHISInstanceDTO> instanceDTOList = new ArrayList<>();
        instanceList.forEach(instance->{
            DHISInstanceDTO instanceDTO=dhisMapper.toDHISInstanceDTO(instance);
            instanceDTOList.add(instanceDTO);
        });
        return instanceDTOList;
    }

    public String addDHISInstance(DHISInstanceDTO instanceDTO){
        dhisInstanceRepository.save(dhisMapper.toDHISInstance(instanceDTO));
        return "{'success':'success'}";
    }

    public List<DHISDatasetDTO> getAllDatasets(){
        List <DHISDataset> datasets= datasetsRepository.findAll();
        List<DHISDatasetDTO> datasetDTOList= new ArrayList<>();
        datasets.forEach(dataset->{
            DHISDatasetDTO datasetDTO= dhisMapper.toDatasetDTO(dataset);
            datasetDTOList.add(datasetDTO);
        });
        return datasetDTOList;
    }
    public String addDataset(String dhisId, DHISDatasetDTO datasetDTO){
        if(NumberUtils.isDigits(dhisId) && dhisInstanceRepository.existsDHISInstanceById(Long.parseLong(dhisId))){
            DHISDataset dataset = dhisMapper.toDHISDataset(datasetDTO);
            dataset.setDhisId(Long.parseLong(dhisId));
            datasetsRepository.save(dataset);
            return "{'success':'success'}";
        }else{
            return" {'error':'invalid instance'}";
        }
    }

    public List<DHISDataelementDTO> getDatasetElements(String datasetId){
        List<DHISDataelement> dhisDataelement = dataelementRepository.findAll();
        List<DHISDataelementDTO> dataelementDTOList=new ArrayList<>();
        dhisDataelement.forEach(dataelement->{
            DHISDataelementDTO dhisDataelementDTO =dhisMapper.toDataelementDTO(dataelement);
            dataelementDTOList.add(dhisDataelementDTO) ;
        });
        return dataelementDTOList;
    }

    public String addDataelement(String datasetId, DHISDataelementDTO dataelementDTO){
        if(NumberUtils.isDigits(datasetId) && datasetsRepository.existsDHISDatasetById(Long.parseLong(datasetId))){
            DHISDataelement dataelement =dhisMapper.toDataelement(dataelementDTO);
            dataelementRepository.save(dataelement);
            return "{'success':'success'}";
        }else{
            return" {'error':'invalid dataset'}";
        }
    }

    public List<DHISDatavalueDTO> getDatasetValues(String datasetId){
        if(NumberUtils.isDigits(datasetId) && datasetsRepository.existsDHISDatasetById(Long.parseLong(datasetId))){
            List<DHISDatavalue> datavalues= datavaluesRepository.findAll();
            List<DHISDatavalueDTO> datavalueDTOList= new ArrayList<>();
            datavalues.forEach(datavalue->{
                DHISDatavalueDTO datavalueDTO=dhisMapper.toDatavalueDTO(datavalue);
                datavalueDTOList.add(datavalueDTO);
            });
            return datavalueDTOList;
        }
       return new ArrayList<>();
    }
}
