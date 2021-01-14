package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.Menu;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.lamisplus.modules.base.domain.mapper.StandardCodesetSourceMapper;
import org.lamisplus.modules.base.repository.MenuRepository;
import org.lamisplus.modules.base.repository.StandardCodesetSourceRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;
    private final UserService userService;
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;
    private final GenericSpecification<Menu> genericSpecification;

    public List<Menu> getAllMenu() {
        Specification<Menu> menuSpecification = genericSpecification.findAll(0);
        return menuRepository.findAll(menuSpecification);
    }

    public Menu save(Menu menu) {
        Optional<Menu> menuOptional = menuRepository.findByIdAndArchived(menu.getId(), UN_ARCHIVED);
        if (menuOptional.isPresent()) throw new RecordExistException(Menu.class, "Id", menu.getId() + "");

        menu.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        menu.setArchived(UN_ARCHIVED);
        return menuRepository.save(menu);
    }

    public Menu getMenuById(Long id) {
        Optional<Menu> menuOptional = menuRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!menuOptional.isPresent()) throw new EntityNotFoundException(Menu.class, "Id", id + "");

        return menuOptional.get();
    }

    public Menu update(Long id, Menu menu) {
        Optional<Menu> menuOptional = menuRepository.findByIdAndArchived(menu.getId(), UN_ARCHIVED);
        if (menuOptional.isPresent()) throw new EntityNotFoundException(Menu.class, "Id", id + "");
        menu.setId(id);
        menu.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        menu.setArchived(UN_ARCHIVED);
        return menuRepository.save(menu);
    }

    public Integer delete(Long id) {
        Optional<Menu> menuOptional = menuRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!menuOptional.isPresent()) throw new EntityNotFoundException(Menu.class, "Id", id + "");
        Menu menu = menuOptional.get();
        menu.setArchived(ARCHIVED);
        menu.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        menuRepository.save(menu);

        return ARCHIVED;
    }
}
