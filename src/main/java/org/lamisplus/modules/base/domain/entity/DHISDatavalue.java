package org.lamisplus.modules.base.domain.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "dhis_datavalues")
public class DHISDatavalue implements Serializable{

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "period", updatable = false)
    @NotNull
    private String period;

    @Basic
    @Column(name = "dataset_uid", updatable = false)
    @NotNull
    private String datasetUid;

    @Basic
    @Column(name = "dataelement_uid", updatable = false)
    private String dataelementUid;


    @Basic
    @Column(name = "categoryoptioncombo_uid", updatable = false)
    private String categoryOptionComboUid;

    @Basic
    @Column(name = "attributeoptioncombo_uid", updatable = false)
    private String attributeOptionComboUid;
    @Basic
    @Column(name = "datavalue", updatable = false)
    private String datavalue;

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

}
