package org.lamisplus.modules.base.repository;


import org.lamisplus.modules.base.domain.entity.Update;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateRepository extends JpaRepository<Update, Long> {

}
