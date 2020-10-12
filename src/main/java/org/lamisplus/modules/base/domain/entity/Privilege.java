package org.lamisplus.modules.base.domain.entity;

import lombok.*;
import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@RequiredArgsConstructor
public class Privilege {
    @Id
    @Getter
    @Setter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    @ManyToMany(mappedBy = "privileges", cascade = CascadeType.PERSIST)
    private Set<Role> roles;

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
        if (another == null || !(another instanceof Privilege))
            return false;

        Privilege anotherPrivilege = (Privilege) another;

        return (anotherPrivilege.id != null && (anotherPrivilege.id == this.id))
                || (anotherPrivilege.id == null && anotherPrivilege.name != null && (anotherPrivilege.name.equals(this.name)));
    }

}