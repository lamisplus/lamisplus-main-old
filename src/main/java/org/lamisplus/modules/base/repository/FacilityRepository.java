package org.lamisplus.modules.base.repository;

import org.lamisplus.modules.base.domain.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Country, Long> {

}
