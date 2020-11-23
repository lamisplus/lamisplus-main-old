package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "application_codeset_standard_codeset")
public class ApplicationCodesetStandardCodeset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "application_codeset_id")
    private Long applicationCodesetId;

    @ManyToOne
    @JoinColumn(name = "application_codeset_id", referencedColumnName = "id", insertable = false, updatable = false)
    private ApplicationCodeset applicationCodesetByApplicationCodesetId;

    @ManyToOne
    @JoinColumn(name = "standard_codeset_id", referencedColumnName = "id", insertable = false, updatable = false)
    private StandardCodeset standardCodesetByStandardCodesetId;
}
