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

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {
    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    private final ApplicationUserOrganisationUnitMapper applicationUserOrganisationUnitMapper;
    private final UserService userService;
    private final Constants.ArchiveStatus constant;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<ApplicationUserOrganisationUnit> save(Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO1) {
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnitList = new ArrayList<>();
        applicationUserOrganisationUnitDTO1.forEach(applicationUserOrganisationUnitDTO -> {
            applicationUserOrganisationUnitRepository.findAllByApplicationUserIdAndArchived(userService.getUserWithRoles().get().getId(), constant.UN_ARCHIVED)
                    .forEach(applicationUserOrganisationUnit -> {
                        applicationUserOrganisationUnitRepository.deleteById(applicationUserOrganisationUnit.getId());
                    });

            ApplicationUserOrganisationUnit applicationUserOrganisationUnit = applicationUserOrganisationUnitMapper.toApplicationUserOrganisationUnit(applicationUserOrganisationUnitDTO);
            applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
            applicationUserOrganisationUnitList.add(applicationUserOrganisationUnit);
        });
        return applicationUserOrganisationUnitList;
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

    public void setCurrentOrganisationUnit(Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS){
        Long orgUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        if(null == orgUnitId){
            Optional<UserDTO> optionalUserDTO = userService.getUserWithRoles().map(UserDTO::new);
            if(optionalUserDTO.isPresent()){
                for (ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO : applicationUserOrganisationUnitDTOS) {
                    UserDTO userDTO = optionalUserDTO.get();
                    userDTO.setCurrentOrganisationUnitId(applicationUserOrganisationUnitDTO.getOrganisationUnitId());
                    userRepository.save(userMapper.userDTOToUser(userDTO));
                    break;
                }
            }
        }
    }
}
