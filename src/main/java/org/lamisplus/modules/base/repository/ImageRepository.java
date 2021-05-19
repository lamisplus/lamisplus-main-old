package org.lamisplus.modules.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.lamisplus.modules.base.domain.entity.Image;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByUuid(String uuid);
}