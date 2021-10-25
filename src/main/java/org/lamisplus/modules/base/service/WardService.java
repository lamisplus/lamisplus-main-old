package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.WardDTO;
import org.lamisplus.modules.base.domain.entity.Ward;
import org.lamisplus.modules.base.domain.mapper.WardMapper;
import org.lamisplus.modules.base.repository.WardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class WardService {
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;
    private final WardRepository wardRepository;
    private final WardMapper wardMapper;
    private final UserService userService;


    public List<WardDTO> getAllWards(){
        Long orgUnitId = getOrganisationUnitId();
        List<Ward> wardList = wardRepository.findAllByArchivedAndOrganisationUnitId(UN_ARCHIVED, orgUnitId);
         return wardMapper.toWardDTOList(wardList);
    }

    public Ward save(WardDTO wardDTO){
        Long orgUnitId = getOrganisationUnitId();
        Optional<Ward> wardOptional = wardRepository.findByNameAndArchivedAndOrganisationUnitId(wardDTO.getName(), UN_ARCHIVED, orgUnitId);
        if (wardOptional.isPresent()) throw new RecordExistException(Ward.class,"Name:",wardDTO.getName());
        Ward ward = wardMapper.toWard(wardDTO);
        ward.setOrganisationUnitId(getOrganisationUnitId());
        ward.setCode(UUID.randomUUID().toString());
        return wardRepository.save(ward);
    }


    public WardDTO getWard(Long id){
        Long orgUnitId = getOrganisationUnitId();
        Ward ward = wardRepository.findByIdAndArchivedAndOrganisationUnitId(id, UN_ARCHIVED, orgUnitId)
                .orElseThrow(() -> new EntityNotFoundException(Ward.class,"Id:",id+""));
        return wardMapper.toWardDTO(ward);
    }

    public Ward update(Long id, WardDTO wardDTO){
        Long orgUnitId = getOrganisationUnitId();
        wardRepository.findByIdAndArchivedAndOrganisationUnitId(id, UN_ARCHIVED, orgUnitId)
                .orElseThrow(() -> new EntityNotFoundException(Ward.class,"Id:",id+""));
        final Ward ward = wardMapper.toWard(wardDTO);
        ward.setId(id);
        return wardRepository.save(ward);
    }

    public Integer delete(Long id){
        Long orgUnitId = getOrganisationUnitId();
        Ward ward = wardRepository.findByIdAndArchivedAndOrganisationUnitId(id, UN_ARCHIVED, orgUnitId)
                .orElseThrow(() -> new EntityNotFoundException(Ward.class,"Id:",id+""));
        ward.setArchived(ARCHIVED);
        wardRepository.save(ward);
        return ward.getArchived();
    }

    public Boolean exist(String name){
        return wardRepository.existsByName(name);
    }

    private Long getOrganisationUnitId(){
        return userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
    }

}
