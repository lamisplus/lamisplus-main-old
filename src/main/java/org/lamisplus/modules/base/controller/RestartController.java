package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.vm.ManagedUserVM;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entity.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.repository.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.repository.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.lamisplus.modules.bootstrap.config.DynamicModuleImportConfigurer;
import org.lamisplus.modules.bootstrap.domain.entity.Menu;
import org.lamisplus.modules.bootstrap.domain.entity.Module;
import org.lamisplus.modules.bootstrap.repository.MenuRepository;
import org.lamisplus.modules.bootstrap.repository.ModuleRepository;
import org.lamisplus.modules.bootstrap.service.ModuleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static org.lamisplus.modules.bootstrap.config.DynamicModuleImportConfigurer.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestartController {
    private final ModuleService moduleService;
    private final ModuleRepository moduleRepository;
    private final MenuRepository menuRepository;
    private final JdbcTemplate jdbcTemplate;


    @PostMapping("/restart")
    public void restart() {
        BaseApplication.restart();
    }

    @PostMapping("/module/uninstall/{id}")
    public void uninstall(@PathVariable String id) {
        Module module= moduleRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(Module.class, "id", ""+id));
        jdbcTemplate.update("DELETE FROM menu WHERE module_id=? ", module.getId());
        moduleService.uninstall(id);
        jdbcTemplate.update("DELETE FROM module WHERE id=? ", module.getId());
    }
}
