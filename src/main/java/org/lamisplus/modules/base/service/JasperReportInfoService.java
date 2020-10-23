package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.JasperReportInfoDTO;
import org.lamisplus.modules.base.domain.entity.JasperReportInfo;
import org.lamisplus.modules.base.domain.mapper.JasperReportInfoMapper;
import org.lamisplus.modules.base.repository.JasperReportInfoRepository;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class JasperReportInfoService {
    private final JasperReportInfoRepository jasperReportInfoRepository;
    private final JasperReportInfoMapper jasperReportInfoMapper;

    public JasperReportInfo save(JasperReportInfoDTO jasperReportInfoDTO) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findByName(jasperReportInfoDTO.getName());
        if (optional.isPresent()) throw new RecordExistException(JasperReportInfo.class, "name", jasperReportInfoDTO.getName());
        JasperReportInfo jasperReportInfo = this.jasperReportInfoMapper.toJasperReportInfo(jasperReportInfoDTO);
        jasperReportInfo.setArchived(0);
        return jasperReportInfoRepository.save(jasperReportInfo);
    }

    public JasperReportInfo update(Long id, JasperReportInfoDTO jasperReportInfoDTO) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(JasperReportInfo.class, "Id", id +"");
        jasperReportInfoDTO.setId(id);

        JasperReportInfo jasperReportInfo = jasperReportInfoMapper.toJasperReportInfo(jasperReportInfoDTO);
        return jasperReportInfoRepository.save(jasperReportInfo);
    }

    public Integer delete(Long id) {
        Optional<JasperReportInfo> optional = jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1)throw new EntityNotFoundException(JasperReportInfo.class, "Id", id +"");
        optional.get().setArchived(1);
        return optional.get().getArchived();
    }

    public JasperReportInfo getJasperReport(Long id) {
        Optional<JasperReportInfo> optional = this.jasperReportInfoRepository.findById(id);
        if(!optional.isPresent() || optional.get().getArchived() == 1) throw new EntityNotFoundException(JasperReportInfo.class, "Id", id+"");
        return optional.get();
    }

    public List<JasperReportInfo> getJasperReports() {
        GenericSpecification<JasperReportInfo> genericSpecification = new GenericSpecification<JasperReportInfo>();
        Specification<JasperReportInfo> specification = genericSpecification.findAll();
        return jasperReportInfoRepository.findAll(specification);
    }

}
