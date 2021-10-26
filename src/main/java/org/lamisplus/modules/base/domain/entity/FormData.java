package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "form_data")
public class FormData extends JsonBEntity implements Serializable {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data", nullable = false, columnDefinition = "jsonb")
    private Object data;

    @Basic
    @Column(name = "encounter_id")
    private Long encounterId;

    @Basic
    @Column(name = "organisation_unit_id", updatable = false)
    @JsonIgnore
    private Long organisationUnitId;

    @ManyToOne
    @JoinColumn(name = "encounter_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Encounter encounterByEncounterId;

    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ToString.Exclude
    public OrganisationUnit organisationUnitByOrganisationUnitId;
}
