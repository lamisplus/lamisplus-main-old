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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {

    private static final int UN_ARCHIVED = 0;
    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    //private final UserService userService;
    private final ApplicationUserOrganisationUnitMapper applicationUserOrganisationUnitMapper;


    public List<ApplicationUserOrganisationUnit> save(List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO1) {
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitList = new ArrayList<>();
        applicationUserOrganisationUnitDTO1.forEach(applicationUserOrganisationUnitDTO -> {
            Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = applicationUserOrganisationUnitRepository.
                    findByApplicationUserIdAndOrganisationUnitIdAndArchived(applicationUserOrganisationUnitDTO.getApplicationUserId(),
                            applicationUserOrganisationUnitDTO.getOrganisationUnitId(), UN_ARCHIVED);
            if(applicationUserOrganisationUnitOptional.isPresent())
                throw new RecordExistException(ApplicationUserOrganisationUnit.class, "mapping",
                        applicationUserOrganisationUnitDTO.getApplicationUserId() + " and " + applicationUserOrganisationUnitDTO.getOrganisationUnitId());

            ApplicationUserOrganisationUnit applicationUserOrganisationUnit = applicationUserOrganisationUnitMapper.toApplicationUserOrganisationUnit(applicationUserOrganisationUnitDTO);
            applicationUserOrganisationUnitList.add(applicationUserOrganisationUnit);
        });

        return applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnitList);
    }

    public ApplicationUserOrganisationUnit update(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = applicationUserOrganisationUnitRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if(!applicationUserOrganisationUnitOptional.isPresent())throw new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +"");
        applicationUserOrganisationUnit.setId(id);
        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }

    public ApplicationUserOrganisationUnit getApplicationUserOrganisationUnit(Long id){
        Optional<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitOptional = this.applicationUserOrganisationUnitRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!applicationUserOrganisationUnitOptional.isPresent())throw new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +"");
        return applicationUserOrganisationUnitOptional.get();
    }

    public List<ApplicationUserOrganisationUnit> getAllApplicationUserOrganisationUnit() {
        return applicationUserOrganisationUnitRepository.findAllByArchived(UN_ARCHIVED);
    }

    public Boolean delete(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return true;
    }
}
