package org.lamisplus.modules.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.lamisplus.modules.base.domain.entity.Image;

@Repository
public interface ImageDbRepository extends JpaRepository<Image, Long> {}