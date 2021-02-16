package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "appointment")
public class Appointment extends Audit<String>{

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Basic
    @Column(name = "date")
    private Timestamp date;
    
    @Column(name = "patient_id")
    private Long patientId;
    
    @Basic
    @Column(name = "visit_id")
    private Long visitId;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "detail", nullable = false, columnDefinition = "jsonb")
    private Object detail;
    
    @Basic
    @Column(name = "organisation_unit_id")
    private Long organisationUnitId;
    
    @Basic
    @Column(name = "archived")
    private Integer archived = 0;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Patient patientByPatientId;
    
    @ManyToOne
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private OrganisationUnit organisationUnitByOrganisationUnitId;
}
