package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collection;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Role extends Audit<String> {
    @Id
    @GeneratedValue
    @Getter
    @Setter
    private Long id;

    @NonNull
    @Getter
    @Setter
    private String name;

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @CreatedDate
    @Column(name = "date_created", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private Timestamp dateCreated = Timestamp.from(Instant.now());

    @LastModifiedBy
    @Column(name = "modified_by")
    @JsonIgnore
    @ToString.Exclude
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @LastModifiedDate
    @Column(name = "date_modified")
    @JsonIgnore
    @ToString.Exclude
    private Timestamp dateModified = Timestamp.from(Instant.now());

    @Getter
    @Setter
    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<Permission> permission;
    //private Collection<ApplicationUserRole> applicationUserRolesById;
    /*@OneToMany(mappedBy = "roleByRoleId")
    public Collection<ApplicationUserRole> getApplicationUserRolesById() {
        return applicationUserRolesById;
    }

    public void setApplicationUserRolesById(Collection<ApplicationUserRole> applicationUserRolesById) {
        this.applicationUserRolesById = applicationUserRolesById;
    }*/
    //private Collection<RolePermission> rolePermissionsById;

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
    public Collection<RolePermission> getRolePermissionsById() {
        return rolePermissionsById;
    }

    public void setRolePermissionsById(Collection<RolePermission> rolePermissionsById) {
        this.rolePermissionsById = rolePermissionsById;
    }*/
}
