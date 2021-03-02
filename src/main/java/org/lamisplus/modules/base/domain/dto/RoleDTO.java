package org.lamisplus.modules.base.domain.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.lamisplus.modules.base.domain.entity.Permission;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;
    private List<Permission> permissions;
}
