package org.lamisplus.modules.base.domain.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode
@NoArgsConstructor
@RequiredArgsConstructor
public class Permission {
    @Id
    @GeneratedValue
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String description;
}