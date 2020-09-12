package org.lamisplus.modules.base.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "jasper_report_info")
public class JasperReportInfo extends JsonBEntity implements Serializable {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "datasource")
    private String datasource;

    @Basic
    @Column(name = "program_code")
    private String programCode;

    //@Type(type="org.lamisplus.modules.base.domain.entity.SQLXMLType")
    //@Column(name="template", nullable=false, columnDefinition = "xml")
    private String template;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "parameter_resource_object", nullable = false, columnDefinition = "jsonb")
    private Object parameterResourceObject;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;

}
