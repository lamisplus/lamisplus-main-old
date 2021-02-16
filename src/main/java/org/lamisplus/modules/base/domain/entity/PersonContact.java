package org.lamisplus.modules.base.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "person_contact")
public class PersonContact implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "mobile_phone_number")
    private String mobilePhoneNumber;

    @Basic
    @Column(name = "alternate__phone_number")
    private String alternatePhoneNumber;

    @Basic
    @Column(name = "email")
    private String email;

    @Basic
    @Column(name = "zip_code")
    private String zipCode;

    @Basic
    @Column(name = "city")
    private String city;

    @Basic
    @Column(name = "street")
    private String street;

    @Basic
    @Column(name = "landmark")
    private String landmark;

    @Basic
    @Column(name = "country_id", updatable = false)
    private Long countryId;

    @Basic
    @Column(name = "state_id")
    private Long stateId;

    @Basic
    @Column(name = "province_id")
    private Long provinceId;

    @Basic
    @Column(name = "person_id", updatable = false)
    private Long personId;

    @OneToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Person personByPersonId;
}
