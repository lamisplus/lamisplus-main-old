package org.lamisplus.modules.base.base.domain.dto;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Time;
import java.util.Objects;

@Data
public class WardDTO {
    private Long id;
    private String name;
}
