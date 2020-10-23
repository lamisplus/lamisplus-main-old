package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Regimen;
import org.lamisplus.modules.base.domain.entity.RegimenLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegimenRepository extends JpaRepository<Regimen, Long> {
}
