package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitHierarchy;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitLevel;
import org.lamisplus.modules.base.domain.mapper.OrganisationUnitMapper;
import org.lamisplus.modules.base.repository.OrganisationUnitHierarchyRepository;
import org.lamisplus.modules.base.repository.OrganisationUnitLevelRepository;
import org.lamisplus.modules.base.repository.OrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitService {
    private static final int UNARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private static final Long firstLevel = 1L;
    private final OrganisationUnitRepository organisationUnitRepository;
    private final OrganisationUnitMapper organisationUnitMapper;
    private final OrganisationUnitHierarchyRepository organisationUnitHierarchyRepository;

    public OrganisationUnit save(OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByNameAndParentOrganisationUnitIdAndArchived(organisationUnitDTO.getName(), organisationUnitDTO.getId(), UNARCHIVED);
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnit.class, "Name", organisationUnitDTO.getName() +"");
        final OrganisationUnit organisationUnit = organisationUnitMapper.toOrganisationUnit(organisationUnitDTO);

        OrganisationUnit organisationUnit1 = organisationUnitRepository.save(organisationUnit);
        Long level = organisationUnit1.getOrganisationUnitLevelId();
        List<OrganisationUnitHierarchy> organisationUnitHierarchies = new ArrayList<>();
        OrganisationUnit returnOrgUnit = organisationUnit1;

        Long parent_org_unit_id = 1L;
        while(parent_org_unit_id > 0){
            parent_org_unit_id = organisationUnit1.getParentOrganisationUnitId();
            organisationUnitHierarchies.add(new OrganisationUnitHierarchy(null, returnOrgUnit.getId(), organisationUnit1.getParentOrganisationUnitId(),
                    level, null, null, null));

            Optional<OrganisationUnit> organisationUnitOptional = organisationUnitRepository.findById(organisationUnit1.getParentOrganisationUnitId());
            if(organisationUnitOptional.isPresent()){
                organisationUnit1 = organisationUnitOptional.get();
            }
            --parent_org_unit_id;
        }
        organisationUnitHierarchyRepository.saveAll(organisationUnitHierarchies);
        return returnOrgUnit;
    }

    //TODO: work on this
    public OrganisationUnit update(Long id, OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if(!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        final OrganisationUnit organisationUnit = organisationUnitMapper.toOrganisationUnit(organisationUnitDTO);

        organisationUnit.setId(id);
        return organisationUnitRepository.save(organisationUnit);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if (!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        organizationOptional.get().setArchived(ARCHIVED);
        return organizationOptional.get().getArchived();
    }

    public OrganisationUnit getOrganizationUnit(Long id){
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if (!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        return organizationOptional.get();
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitId(Long id) {
        return  organisationUnitRepository.findAllOrganisationUnitByParentOrganisationUnitIdAndArchived(id, UNARCHIVED);
    }

    public List<OrganisationUnit> getAllOrganizationUnit() {
        return organisationUnitRepository.findAllByArchivedOrderByIdAsc(UNARCHIVED);
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parentOrgUnitId, Long orgUnitLevelId) {
        return organisationUnitRepository.findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(parentOrgUnitId, orgUnitLevelId);
    }

    public List<OrganisationUnit> getOrganisationUnitByOrganisationUnitLevelId(Long id) {
        return organisationUnitRepository.findAllByOrganisationUnitLevelId(id);
    }

    public List<OrganisationUnitDTO> getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parent_org_unit_id, Long org_unit_level_id) {
        List<OrganisationUnitHierarchy> organisationUnitHierarchies = organisationUnitHierarchyRepository.findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(parent_org_unit_id, org_unit_level_id);
        List<OrganisationUnitDTO> organisationUnitDTOS = new ArrayList<>();
        organisationUnitHierarchies.forEach(organisationUnitHierarchy -> {
            final OrganisationUnitDTO organisationUnitDTO = organisationUnitMapper.toOrganisationUnitDTO(organisationUnitHierarchy.getOrganisationUnitByOrganisationUnitId());
            organisationUnitDTOS.add(organisationUnitDTO);
        });
        return organisationUnitDTOS;
    }

    public List<OrganisationUnit> getAllOrganisationUnitByOrganisationUnitLevelId(Long organisationUnitLevelId) {
        List<Long> level = new ArrayList<>();
        for(Long i=firstLevel; i <= organisationUnitLevelId; i++){
            level.add(i);
        }
        return organisationUnitRepository.findAllByOrganisationUnitLevelIdIn(level);
    }
}
