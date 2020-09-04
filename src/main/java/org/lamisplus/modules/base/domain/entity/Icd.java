package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "icd")
public class Icd implements Serializable {

    private Long id;
    private String categoryCode;
    private String diagnosisCode;
    private String fullCode;
    private String abbreviatedDescription;
    private String fullDescription;
    private String categoryTitle;
    private Integer archived = 0;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "category_code")
    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    @Basic
    @Column(name = "diagnosis_code")
    public String getDiagnosisCode() {
        return diagnosisCode;
    }

    public void setDiagnosisCode(String diagnosisCode) {
        this.diagnosisCode = diagnosisCode;
    }

    @Basic
    @Column(name = "full_code")
    public String getFullCode() {
        return fullCode;
    }

    public void setFullCode(String fullCode) {
        this.fullCode = fullCode;
    }

    @Basic
    @Column(name = "abbreviated_description")
    public String getAbbreviatedDescription() {
        return abbreviatedDescription;
    }

    public void setAbbreviatedDescription(String abbreviatedDescription) {
        this.abbreviatedDescription = abbreviatedDescription;
    }

    @Basic
    @Column(name = "full_description")
    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    @Basic
    @Column(name = "category_title")
    public String getCategoryTitle() {
        return categoryTitle;
    }

    public void setCategoryTitle(String categoryTitle) {
        this.categoryTitle = categoryTitle;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Icd that = (Icd) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(categoryCode, that.categoryCode) &&
                Objects.equals(diagnosisCode, that.diagnosisCode) &&
                Objects.equals(fullCode, that.fullCode) &&
                Objects.equals(abbreviatedDescription, that.abbreviatedDescription) &&
                Objects.equals(fullDescription, that.fullDescription) &&
                Objects.equals(categoryTitle, that.categoryTitle);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, categoryCode, diagnosisCode, fullCode, abbreviatedDescription, fullDescription, categoryTitle);
    }

    @Basic
    @Column(name = "archived")
    public Integer getArchived() {
        return archived;
    }

    public void setArchived(Integer archived) {
        this.archived = archived;
    }
}
