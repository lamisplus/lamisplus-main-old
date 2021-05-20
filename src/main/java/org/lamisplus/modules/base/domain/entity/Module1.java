package org.lamisplus.modules.base.domain.entity;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Module1 {
    private String id;
    private Boolean active;
    private String artifact;
    private String basePackage;
    private Timestamp dateCreated;
    private String description;
    private String name;
    private String version;
    private String createdBy;
    private Time dateModified;
    private String modifiedBy;
    private Integer archived;
    private Integer moduleType;
    private String uuid;
    private Timestamp dateInstalled;
    private String installedBy;
    private Integer status;
    private String main;
    private String batchNo;
    private byte[] data;
    private Boolean started;
    private Boolean uninstall;
    private String artifactId;
    private Boolean processConfig;
    private Date buildTime;
    private Collection<Menu> menusById;

    @Id
    @Column(name = "id")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name = "active")
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Basic
    @Column(name = "artifact")
    public String getArtifact() {
        return artifact;
    }

    public void setArtifact(String artifact) {
        this.artifact = artifact;
    }

    @Basic
    @Column(name = "base_package")
    public String getBasePackage() {
        return basePackage;
    }

    public void setBasePackage(String basePackage) {
        this.basePackage = basePackage;
    }

    @Basic
    @Column(name = "date_created")
    public Timestamp getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Timestamp dateCreated) {
        this.dateCreated = dateCreated;
    }

    @Basic
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "version")
    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @Basic
    @Column(name = "created_by")
    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Basic
    @Column(name = "date_modified")
    public Time getDateModified() {
        return dateModified;
    }

    public void setDateModified(Time dateModified) {
        this.dateModified = dateModified;
    }

    @Basic
    @Column(name = "modified_by")
    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    @Basic
    @Column(name = "archived")
    public Integer getArchived() {
        return archived;
    }

    public void setArchived(Integer archived) {
        this.archived = archived;
    }

    @Basic
    @Column(name = "module_type")
    public Integer getModuleType() {
        return moduleType;
    }

    public void setModuleType(Integer moduleType) {
        this.moduleType = moduleType;
    }

    @Basic
    @Column(name = "uuid")
    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    @Basic
    @Column(name = "date_installed")
    public Timestamp getDateInstalled() {
        return dateInstalled;
    }

    public void setDateInstalled(Timestamp dateInstalled) {
        this.dateInstalled = dateInstalled;
    }

    @Basic
    @Column(name = "installed_by")
    public String getInstalledBy() {
        return installedBy;
    }

    public void setInstalledBy(String installedBy) {
        this.installedBy = installedBy;
    }

    @Basic
    @Column(name = "status")
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @Basic
    @Column(name = "main")
    public String getMain() {
        return main;
    }

    public void setMain(String main) {
        this.main = main;
    }

    @Basic
    @Column(name = "batch_no")
    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    @Basic
    @Column(name = "data")
    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Basic
    @Column(name = "started")
    public Boolean getStarted() {
        return started;
    }

    public void setStarted(Boolean started) {
        this.started = started;
    }

    @Basic
    @Column(name = "uninstall")
    public Boolean getUninstall() {
        return uninstall;
    }

    public void setUninstall(Boolean uninstall) {
        this.uninstall = uninstall;
    }

    @Basic
    @Column(name = "artifact_id")
    public String getArtifactId() {
        return artifactId;
    }

    public void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    @Basic
    @Column(name = "process_config")
    public Boolean getProcessConfig() {
        return processConfig;
    }

    public void setProcessConfig(Boolean processConfig) {
        this.processConfig = processConfig;
    }

    @Basic
    @Column(name = "build_time")
    public Date getBuildTime() {
        return buildTime;
    }

    public void setBuildTime(Date buildTime) {
        this.buildTime = buildTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Module1 module1 = (Module1) o;
        return Objects.equals(id, module1.id) &&
                Objects.equals(active, module1.active) &&
                Objects.equals(artifact, module1.artifact) &&
                Objects.equals(basePackage, module1.basePackage) &&
                Objects.equals(dateCreated, module1.dateCreated) &&
                Objects.equals(description, module1.description) &&
                Objects.equals(name, module1.name) &&
                Objects.equals(version, module1.version) &&
                Objects.equals(createdBy, module1.createdBy) &&
                Objects.equals(dateModified, module1.dateModified) &&
                Objects.equals(modifiedBy, module1.modifiedBy) &&
                Objects.equals(archived, module1.archived) &&
                Objects.equals(moduleType, module1.moduleType) &&
                Objects.equals(uuid, module1.uuid) &&
                Objects.equals(dateInstalled, module1.dateInstalled) &&
                Objects.equals(installedBy, module1.installedBy) &&
                Objects.equals(status, module1.status) &&
                Objects.equals(main, module1.main) &&
                Objects.equals(batchNo, module1.batchNo) &&
                Arrays.equals(data, module1.data) &&
                Objects.equals(started, module1.started) &&
                Objects.equals(uninstall, module1.uninstall) &&
                Objects.equals(artifactId, module1.artifactId) &&
                Objects.equals(processConfig, module1.processConfig) &&
                Objects.equals(buildTime, module1.buildTime);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, active, artifact, basePackage, dateCreated, description, name, version, createdBy, dateModified, modifiedBy, archived, moduleType, uuid, dateInstalled, installedBy, status, main, batchNo, started, uninstall, artifactId, processConfig, buildTime);
        result = 31 * result + Arrays.hashCode(data);
        return result;
    }
}
