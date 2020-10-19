package org.lamisplus.modules.base.domain.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "authority")
public class Authority implements Serializable {
    @NotNull
    @Size(max = 50)
    @Id
    @Column(length = 50)
    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(name = "Permission")
    private Set<Permission> permissions;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Authority)) {
            return false;
        }
        return Objects.equals(name, ((Authority) o).name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    @Override
    public String toString() {
        return "Authority{" + "name='" + name + '\'' + "}";
    }
}
