package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitLevel;
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

    private final OrganisationUnitLevelRepository organisationUnitLevelRepository;

    public OrganisationUnitLevel save(OrganisationUnitLevel organisationUnitLevel) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(organisationUnitLevel.getId());
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnitLevel.class, "Id", organisationUnitLevel.getId() +"");
        return organisationUnitLevelRepository.save(organisationUnitLevel);
    }

    public OrganisationUnitLevel update(Long id, OrganisationUnitLevel organisationUnitLevel) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if(!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        organisationUnitLevel.setId(id);
        return organisationUnitLevelRepository.save(organisationUnitLevel);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        organizationOptional.get().setArchived(1);
        return organizationOptional.get().getArchived();
    }

    public OrganisationUnitLevel getOrganizationUnitLevel(Long id){
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        return organizationOptional.get();
    }

    public List<OrganisationUnitLevel> getAllOrganizationUnitLevel() {
        //TODO: Order the list by id
        return organisationUnitLevelRepository.findAll();
    }

}
