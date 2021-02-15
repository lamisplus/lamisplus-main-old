package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@NoArgsConstructor
@RequiredArgsConstructor
public class Role {
    @Id
    @GeneratedValue
    @Getter
    @Setter
    private Long id;

    @NonNull
    @Getter
    @Setter
    private String name;

    @Basic
    @Column(name = "date_created")
    @JsonIgnore
    @CreationTimestamp
    private Timestamp dateCreated;

    @Basic
    @Column(name = "date_modified")
    @UpdateTimestamp
    private Timestamp dateModified;

    @Getter
    @Setter
    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<Permission> permission;
    //private Collection<ApplicationUserRole> applicationUserRolesById;

    @Override
    public int hashCode() {
        if (id != null) {
            return id.hashCode();
        } else if (name != null) {
            return name.hashCode();
        }

        return 0;
    }

    @Override
    public boolean equals(Object another) {
        if (another == null || !(another instanceof Role))
            return false;

        Role anotherRole = (Role) another;

        return anotherRole.id != null && (anotherRole.id == this.id);
    }

    @Override
    public String toString() {
        return "Roles{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", dateModified='" + dateModified + '\'' +
                ", permissions=" + permission +
                '}';
    }

    /*@OneToMany(mappedBy = "roleByRoleId")
    public Collection<ApplicationUserRole> getApplicationUserRolesById() {
        return applicationUserRolesById;
    }

    public void setApplicationUserRolesById(Collection<ApplicationUserRole> applicationUserRolesById) {
        this.applicationUserRolesById = applicationUserRolesById;
    }*/
}
