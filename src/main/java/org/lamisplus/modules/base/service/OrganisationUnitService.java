package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.repository.OrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitService {
    private final OrganisationUnitRepository organisationUnitRepository;

    public OrganisationUnit save(OrganisationUnit organisationUnit) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findById(organisationUnit.getId());
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnit.class, "Id", organisationUnit.getId() +"");
        return organisationUnitRepository.save(organisationUnit);
    }

    public OrganisationUnit update(Long id, OrganisationUnit organisationUnit) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findById(id);
        if(!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        organisationUnit.setId(id);
        return organisationUnitRepository.save(organisationUnit);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        organizationOptional.get().setArchived(1);
        return organizationOptional.get().getArchived();
    }

    public OrganisationUnit getOrganizationUnit(Long id){
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findById(id);
        if (!organizationOptional.isPresent() || organizationOptional.get().getArchived() == 1)throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        return organizationOptional.get();
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitId(Long id) {
        return  organisationUnitRepository.findOrganisationUnitByParentOrganisationUnitId(id);
    }

    public List<OrganisationUnit> getAllOrganizationUnit() {
        //TODO: Order the list by id
        return organisationUnitRepository.findAll();
    }

}
