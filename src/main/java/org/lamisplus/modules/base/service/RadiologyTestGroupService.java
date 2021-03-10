package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entity.RadiologyTest;
import org.lamisplus.modules.base.domain.entity.RadiologyTestGroup;
import org.lamisplus.modules.base.repository.RadiologyTestGroupRepository;
import org.lamisplus.modules.base.repository.RadiologyTestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RadiologyTestGroupService {
    private static final int UN_ARCHIVED = 0;
    private final RadiologyTestGroupRepository radiologyTestGroupRepository;
    private final RadiologyTestRepository radiologyTestRepository;

    public List<RadiologyTestGroup> getAllRadiologyTestGroups() {
        return this.radiologyTestGroupRepository.findAllByArchivedOrderByIdDesc(UN_ARCHIVED);
    }

    public List<RadiologyTest> getRadiologyTestByGroupId(Long groupId) {
        return this.radiologyTestRepository.findAllByGroupIdAndArchived(groupId, UN_ARCHIVED);
    }
}
