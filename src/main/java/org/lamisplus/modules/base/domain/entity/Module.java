package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import java.util.List;

@Data
public class Module extends org.lamisplus.modules.bootstrap.domain.entity.Module {

    @OneToMany(mappedBy = "moduleByModuleId", targetEntity = Flag.class)
    @JsonIgnore
    @ToString.Exclude
    private List<Flag> getFlagsById;
}
