package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.audit4j.core.annotation.Audit;
import org.lamisplus.modules.base.domain.dto.HeaderUtil;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entity.Menu;
import org.lamisplus.modules.base.domain.entity.StandardCodesetSource;
import org.lamisplus.modules.base.service.MenuService;
import org.lamisplus.modules.base.service.StandardCodesetSourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@Slf4j
@RequiredArgsConstructor
@Audit
public class MenuController {
    private final MenuService menuService;
    //private final String ENTITY_NAME = "Menu";

    @GetMapping
    public ResponseEntity<List<Menu>> getAllStandardCodesetSource() {
        return ResponseEntity.ok(this.menuService.getAllMenu());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @PostMapping
    public ResponseEntity<Menu> save(@RequestBody Menu menu) {
        return ResponseEntity.ok(menuService.save(menu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> update(@PathVariable Long id, @RequestBody Menu menu) {
        return ResponseEntity.ok(this.menuService.update(id, menu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.menuService.delete(id));
    }
}
