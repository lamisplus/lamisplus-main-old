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
    @Getter
    @Setter
    @GeneratedValue
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String display_name;
}