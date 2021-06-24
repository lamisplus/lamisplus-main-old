package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.mapper.ApplicationUserOrganisationUnitMapper;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.repository.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.util.Constants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {
    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    private final ApplicationUserOrganisationUnitMapper applicationUserOrganisationUnitMapper;
    private final UserService userService;
    private final Constants.ArchiveStatus constant;

    public List<ApplicationUserOrganisationUnit> save(Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO1) {
        applicationUserOrganisationUnitDTO1.forEach(applicationUserOrganisationUnitDTO -> {
            applicationUserOrganisationUnitRepository.findAllByApplicationUserIdAndArchived(userService.getUserWithRoles().get().getId(), constant.UN_ARCHIVED)
                    .forEach(applicationUserOrganisationUnit -> {
                        applicationUserOrganisationUnitRepository.deleteById(applicationUserOrganisationUnit.getId());
                    });
        });
        List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS = applicationUserOrganisationUnitDTO1.stream().collect(Collectors.toList());
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnits = applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnitMapper.toApplicationUserOrganisationUnitList(applicationUserOrganisationUnitDTOS));
        return applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnits);
    }

    public ApplicationUserOrganisationUnit update(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        applicationUserOrganisationUnitRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
        applicationUserOrganisationUnit.setId(id);
        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }

    public ApplicationUserOrganisationUnit getApplicationUserOrganisationUnit(Long id){
        return applicationUserOrganisationUnitRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
    }

    public List<ApplicationUserOrganisationUnit> getAllApplicationUserOrganisationUnit() {
        return applicationUserOrganisationUnitRepository.findAllByArchived(constant.UN_ARCHIVED);
    }

    public Boolean delete(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return true;
    }
}
