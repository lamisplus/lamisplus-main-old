package org.lamisplus.modules.base.domain.entity;

import lombok.*;
import javax.persistence.*;
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

    @Getter
    @Setter
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<Permission> permissions;

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
        return name;
    }
}
