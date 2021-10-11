package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "state")
public class State implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @Basic
    @Column(name = "country_id", nullable = false)
    private Long countryId;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Country countryByCountryId;

    @OneToMany(mappedBy = "stateByStateId")
    @JsonIgnore
    @ToString.Exclude
    private List<Province> provincesByState;

    @OneToMany(mappedBy = "stateByStateId")
    @JsonIgnore
    @ToString.Exclude
    private List<PersonContact> personContactsByState;

    @OneToMany(mappedBy = "stateByStateId")
    @JsonIgnore
    @ToString.Exclude
    public List<Organisation> organizationsByState;

}
