package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ProvinceDTO;
import org.lamisplus.modules.base.domain.entity.Province;
import org.lamisplus.modules.base.domain.mapper.ProvinceMapper;
import org.lamisplus.modules.base.repository.ProvinceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProvinceService {

    private final ProvinceRepository provinceRepository;
    private final ProvinceMapper provinceMapper;
    private final UserService userService;


    public Province save(ProvinceDTO provinceDTO) {
        List<Province> provinceList = provinceRepository.findByStateId(provinceDTO.getStateId());
        if (provinceList.size() < 1 || provinceList == null) throw new EntityNotFoundException(Province.class, "State Id", provinceDTO.getStateId() + "");

        Optional<Province> provinceOptional = provinceRepository.findByName(provinceDTO.getName());
        if (provinceOptional.isPresent()) throw new RecordExistException(Province.class, "State Id", provinceDTO.getStateId() + "");

        Province province = provinceMapper.toProvinceDTO(provinceDTO);
        province.setCreatedBy(userService.getUserWithRoles().get().getUserName());

        return provinceRepository.save(province);
    }

    public List<Province> getAllProvinces(){
        return provinceRepository.findAll();
    }

    public Province update(Long id, Province province) {
        Optional<Province> provinceOptional = provinceRepository.findById(id);
        if(!provinceOptional.isPresent() || provinceOptional.get().getArchived() == 1)throw new EntityNotFoundException(Province.class, "Id", id +"");
        province.setId(id);
        province.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return provinceRepository.save(province);
    }

    public Province getProvince(Long id){
        Optional<Province> provinceOptional = provinceRepository.findById(id);
        if (!provinceOptional.isPresent() || provinceOptional.get().getArchived() == 1) throw new EntityNotFoundException(Province.class, "Id", id + "");

        return provinceOptional.get();
    }

    public Integer delete(Long id) {
        Optional<Province> provinceOptional = provinceRepository.findById(id);
        if (!provinceOptional.isPresent() || provinceOptional.get().getArchived() == 1) throw new EntityNotFoundException(Province.class, "Id", id + "");
        provinceOptional.get().setArchived(1);
        provinceOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());

        return provinceOptional.get().getArchived();
    }
}
