package org.lamisplus.modules.base.domain.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@RequiredArgsConstructor
public class Permission {
    @Id
    @Getter
    @Setter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Getter
    @Setter
    private String name;

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
        if (another == null || !(another instanceof Permission))
            return false;

        Permission anotherPermission = (Permission) another;

        return (anotherPermission.id != null && (anotherPermission.id == this.id))
                || (anotherPermission.id == null && anotherPermission.name != null && (anotherPermission.name.equals(this.name)));
    }

}