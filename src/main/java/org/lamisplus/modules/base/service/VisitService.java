package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Person;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.lamisplus.modules.base.domain.mapper.VisitMapper;
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.util.CustomDateTimeFormat;
import org.lamisplus.modules.base.util.UuidGenerator;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class VisitService {
    private final VisitRepository visitRepository;
    private final VisitMapper visitMapper;
    private final UserService userService;

    public List<VisitDTO> getAllVisits() {
        List<VisitDTO> visitDTOS = new ArrayList<>();
        List<Visit> visits = visitRepository.findAll(new Specification<Visit>() {
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
                criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(root.get("dateVisitEnd").as(LocalDate.class),
                        CustomDateTimeFormat.LocalDateByFormat(LocalDate.now(),"dd-MM-yyyy")));
                criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        });
        visits.forEach(visit -> {
            Patient patient = visit.getPatientByVisit();
            Person person = patient.getPersonByPersonId();

            VisitDTO visitDTO = visitMapper.toVisitDTO(visit,person,patient);
            visitDTOS.add(visitDTO);
        });
        return visitDTOS;
    }

    public Visit save(VisitDTO visitDTO) {
        Optional<Visit> visitOptional = this.visitRepository.findByPatientIdAndDateVisitStart(visitDTO.getPatientId(), visitDTO.getDateVisitStart());
        if(visitOptional.isPresent())throw new RecordExistException(Visit.class, "Patient", visitDTO.getPatientId()+"" + ", Visit Start Date =" + visitDTO.getDateVisitStart());

        Visit visit = visitMapper.toVisit(visitDTO);
        visit.setUuid(UuidGenerator.getUuid());
        visit.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        return this.visitRepository.save(visit);
    }

    public VisitDTO getVisit(Long id) {
        Optional<Visit> visitOptional = this.visitRepository.findById(id);
        if (!visitOptional.isPresent() || visitOptional.get().getArchived() == 1 ) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        Patient patient = visitOptional.get().getPatientByVisit();
        Person person = patient.getPersonByPersonId();
        VisitDTO visitDTO = visitMapper.toVisitDTO(visitOptional.get(), person, patient);
        return visitDTO;
    }

    public Visit update(Long id, Visit visit) {
        Optional<Visit> visitOptional = this.visitRepository.findById(id);
        if (!visitOptional.isPresent() || visitOptional.get().getArchived() == 1 ) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        visit.setId(id);
        visit.setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return visitRepository.save(visit);
    }

    public Integer delete(Long id) {
        Optional<Visit> visitOptional = this.visitRepository.findById(id);
        if (!visitOptional.isPresent() || visitOptional.get().getArchived() == 1 ) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        visitOptional.get().setArchived(1);
        visitOptional.get().setModifiedBy(userService.getUserWithRoles().get().getUserName());
        return visitOptional.get().getArchived();
    }

    public Long getVisitType(){
        Long count = visitRepository.countByVisitTypeIdAndArchived(239L, 0);//Unbooked
        count = count + visitRepository.countByVisitTypeIdAndArchived(238L, 0); //booked
        count = count + visitRepository.countByVisitTypeIdAndArchived(373L, 0); //Emergency

        return count;
    }
}
