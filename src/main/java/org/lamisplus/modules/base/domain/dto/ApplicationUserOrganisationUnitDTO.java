package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.domain.entity.User;

import javax.persistence.*;

@Data
public class ApplicationUserOrganisationUnitDTO {
    private Long id;
    private Long applicationUserId;
    private Long organisationUnitId;
/*
    @ManyToOne
    @JoinColumn(name = "application_user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public User applicationUserByApplicationUserId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public OrganisationUnit organisationUnitByOrganisationUnitId;*/
}
