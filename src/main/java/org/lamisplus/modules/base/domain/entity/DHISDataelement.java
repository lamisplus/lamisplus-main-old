package org.lamisplus.modules.base.domain.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "dhis_dataelements")
public class DHISDataelement implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "dataset")
    private String dataset;

    @Basic
    @Column(name = "dataset_uid")
    private String datasetUid;

    @Basic
    @Column(name = "dataelement")
    private String dataelement;

    @Basic
    @Column(name = "dataelement_uid")
    private String dataelementUid;

    @Basic
    @Column(name = "categoryOptionCombo")
    private String categoryOptionCombo;

    @Basic
    @Column(name = "categoryOptionCombo_uid")
    private String categoryOptionComboUid;

    @Basic
    @Column(name = "attributeOptionCombo")
    private String attributeOptionCombo;

    @Basic
    @Column(name = "attributeOptionCombo_uid")
    private String attributeOptionComboUid;


    @Basic
    @Column(name = "data_query")
    private String dataQuery;


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
