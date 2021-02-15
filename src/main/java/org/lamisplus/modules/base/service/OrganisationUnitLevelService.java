package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitLevelDTO;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitLevel;
import org.lamisplus.modules.base.domain.mapper.OrganisationUnitLevelMapper;
import org.lamisplus.modules.base.repository.OrganisationUnitLevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitLevelService {

    public static final int UN_ARCHIVED = 0;
    private final OrganisationUnitLevelRepository organisationUnitLevelRepository;

    private final OrganisationUnitLevelMapper organisationUnitLevelMapper;


    public OrganisationUnitLevelDTO save(OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findByName(organisationUnitLevelDTO.getName());
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnitLevel.class, "Name", organisationUnitLevelDTO.getName() +"");
        OrganisationUnitLevel organisationUnitLevel = organisationUnitLevelMapper.toOrganisationUnitLevel(organisationUnitLevelDTO);
        organisationUnitLevel.setArchived(UN_ARCHIVED);
        organisationUnitLevelRepository.save(organisationUnitLevel);
        return organisationUnitLevelMapper.toOrganisationUnitLevelDTO(organisationUnitLevel);
    }

    public OrganisationUnitLevelDTO update(Long id, OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if(!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        OrganisationUnitLevel organisationUnitLevel = organisationUnitLevelMapper.toOrganisationUnitLevel(organisationUnitLevelDTO);
        organisationUnitLevel.setId(id);
        organisationUnitLevel.setArchived(UN_ARCHIVED);
        organisationUnitLevelRepository.save(organisationUnitLevel);
        return organisationUnitLevelMapper.toOrganisationUnitLevelDTO(organisationUnitLevel);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        return organizationOptional.get().getArchived();
    }

    public OrganisationUnitLevelDTO getOrganizationUnitLevel(Long id){
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        OrganisationUnitLevelDTO organisationUnitLevelDTO = organisationUnitLevelMapper.toOrganisationUnitLevelDTO(organizationOptional.get());
        return organisationUnitLevelDTO;
    }

    public List<OrganisationUnitLevelDTO> getAllOrganizationUnitLevel() {
        //TODO: Order the list by id
        return organisationUnitLevelMapper.toOrganisationUnitLevelDTOList(organisationUnitLevelRepository.findAll());
    }
}
