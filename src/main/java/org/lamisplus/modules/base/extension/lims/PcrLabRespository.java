package org.lamisplus.modules.base.extension.lims;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PcrLabRespository extends JpaRepository<PcrLab, Long> {
    List<PcrLab> findAll();
}
