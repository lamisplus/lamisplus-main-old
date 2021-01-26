package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "person")
public class Person extends Audit<String> {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "dob")
    private LocalDate dob;

    @Basic
    @Column(name = "dob_estimated")
    private Boolean dobEstimated;

    @Basic
    @Column(name = "first_name")
    private String firstName;

    @Basic
    @Column(name = "last_name")
    private String lastName;

    @Basic
    @Column(name = "other_names")
    private String otherNames;

    @Basic
    @Column(name = "education_id")
    private Long educationId;

    @Basic
    @Column(name = "gender_id")
    private Long genderId;

    @Basic
    @Column(name = "occupation_id")
    private Long occupationId;

    @Basic
    @Column(name = "marital_status_id")
    private Long maritalStatusId;

    @Basic
    @Column(name = "person_title_id")
    private Long personTitleId;

    @Basic
    @Column(name = "uuid")
    private String uuid;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

    @OneToMany(mappedBy = "personByPersonId")
    @ToString.Exclude
    @JsonIgnore
    private List<PersonRelative> personRelativesByPerson;

    @OneToOne(mappedBy = "personByPersonId")
    @ToString.Exclude
    @JsonIgnore
    private PersonContact personContactsByPerson;

}
