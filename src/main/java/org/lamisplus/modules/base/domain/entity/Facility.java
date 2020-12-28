package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "facility")
public class Facility implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "facility_code")
    private String facilityCode;

    @Basic
    @Column(name = "facility_level")
    private String facilityLevel;

    @Basic
    @Column(name = "facility_level_option")
    private String facilityLevelOption;

    @Basic
    @Column(name = "facility_name")
    private String facilityName;

    @Basic
    @Column(name = "latitude")
    @NotNull
    private String latitude;

    @Basic
    @Column(name = "longitude")
    private String longitude;

    @Basic
    @Column(name = "ownership")
    @NotNull
    private String ownership;

    @Basic
    @Column(name = "ownership_type")
    @NotNull
    private String ownershipType;

    @Basic
    @Column(name = "physical_location")
    @NotNull
    private String physicalLocation;

    @Basic
    @Column(name = "postal_address")
    @NotNull
    private String postalAddress;

    @Basic
    @Column(name = "start_date")
    @NotNull
    private Date startDate;

    @Basic
    @Column(name = "uuid")
    private String uuid;

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "created_by")
    @JsonIgnore
    private String createdBy;

    @Basic
    @Column(name = "date_modified")
    @JsonIgnore
    @UpdateTimestamp
    private Timestamp dateModified;

    @Basic
    @Column(name = "modified_by")
    @JsonIgnore
    private String modifiedBy;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;

    @OneToMany(mappedBy = "facilityByFacilityId")
    @JsonIgnore
    @ToString.Exclude
    public List<FacilityService> facilityServicesByFacility;


/*    @OneToMany(mappedBy = "facilityByFacilityId")
    @JsonIgnore
    @ToString.Exclude
    public List<Patient> patientsByFacility;*/

}
