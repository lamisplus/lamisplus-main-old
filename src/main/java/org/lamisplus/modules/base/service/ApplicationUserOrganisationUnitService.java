package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.mapper.ApplicationUserOrganisationUnitMapper;
import org.lamisplus.modules.base.repository.ApplicationUserOrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {

    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    private final UserService userService;
    private final ApplicationUserOrganisationUnitMapper applicationUserOrganisationUnitMapper;


    public ApplicationUserOrganisationUnit save(ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO) {
        Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = applicationUserOrganisationUnitRepository.
                findByApplicationUserIdAndOrganisationUnitId(applicationUserOrganisationUnitDTO.getApplicationUserId(), applicationUserOrganisationUnitDTO.getOrganisationUnitId());
        if(applicationUserOrganisationUnitOptional.isPresent())
            throw new RecordExistException(ApplicationUserOrganisationUnit.class, "mapping",
                applicationUserOrganisationUnitDTO.getApplicationUserId() + " and " + applicationUserOrganisationUnitDTO.getOrganisationUnitId());

        ApplicationUserOrganisationUnit applicationUserOrganisationUnit = applicationUserOrganisationUnitMapper.toApplicationUserOrganisationUnit(applicationUserOrganisationUnitDTO);

        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }

    public ApplicationUserOrganisationUnit update(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = applicationUserOrganisationUnitRepository.findById(id);
        if(!applicationUserOrganisationUnitOptional.isPresent())throw new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +"");
        applicationUserOrganisationUnit.setId(id);
        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }

    public ApplicationUserOrganisationUnit getApplicationUserOrganisationUnit(Long id){
        Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = this.applicationUserOrganisationUnitRepository.findById(id);
        if (!applicationUserOrganisationUnitOptional.isPresent())throw new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +"");
        return applicationUserOrganisationUnitOptional.get();
    }

    public List<ApplicationUserOrganisationUnit> getAllApplicationUserOrganisationUnit() {
        return applicationUserOrganisationUnitRepository.findAll();
    }

    public Boolean delete(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return true;
    }
}
