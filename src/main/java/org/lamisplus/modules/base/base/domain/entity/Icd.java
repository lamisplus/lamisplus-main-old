package org.lamisplus.modules.base.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "icd")
public class Icd implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "category_code")
    private String categoryCode;

    @Basic
    @Column(name = "diagnosis_code")
    private String diagnosisCode;

    @Basic
    @Column(name = "full_code")
    private String fullCode;

    @Basic
    @Column(name = "abbreviated_description")
    private String abbreviatedDescription;

    @Basic
    @Column(name = "full_description")
    private String fullDescription;

    @Basic
    @Column(name = "category_title")
    private String categoryTitle;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

}
