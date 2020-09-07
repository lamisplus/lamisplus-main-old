package org.lamisplus.modules.base.domain.entity;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

public class ApplicationCodesetHasStandardCodesetPK implements Serializable {
    private Long applicationCodesetId;
    private Long standardCodesetId;

    @Column(name = "application_codeset_id", nullable = false)
    @Id
    public Long getApplicationCodesetId() {
        return applicationCodesetId;
    }

    public void setApplicationCodesetId(Long applicationCodesetId) {
        this.applicationCodesetId = applicationCodesetId;
    }

    @Column(name = "standard_codeset_id", nullable = false)
    @Id
    public Long getStandardCodesetId() {
        return standardCodesetId;
    }

    public void setStandardCodesetId(Long standardCodesetId) {
        this.standardCodesetId = standardCodesetId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplicationCodesetHasStandardCodesetPK that = (ApplicationCodesetHasStandardCodesetPK) o;
        return Objects.equals(applicationCodesetId, that.applicationCodesetId) &&
                Objects.equals(standardCodesetId, that.standardCodesetId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicationCodesetId, standardCodesetId);
    }
}
