package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "standard_codeset")
public class StandardCodeset extends Audit<String> {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "standard_codeset_source_id")
    private Long standardCodesetSourceId;

    @OneToMany(mappedBy = "standardCodesetByStandardCodesetId")
    @JsonIgnore
    private List<ApplicationCodesetStandardCodeset> applicationCodesetStandardCodesetsById;

    @ManyToOne
    @JoinColumn(name = "standard_codeset_source_id", referencedColumnName = "id", insertable = false, updatable = false)
    private StandardCodesetSource standardCodesetSourceByStandardCodesetSourceId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;
}
