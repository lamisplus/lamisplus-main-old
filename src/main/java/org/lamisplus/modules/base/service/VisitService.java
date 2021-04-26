package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.AppointmentDTO;
import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Appointment;
import org.lamisplus.modules.base.domain.entity.Patient;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.lamisplus.modules.base.domain.mapper.VisitMapper;
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.util.CustomDateTimeFormat;
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
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class VisitService {
    public static final int ARCHIVED = 1;
    public static final int UNARCHIVED = 0;
    private final VisitRepository visitRepository;
    private final VisitMapper visitMapper;
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;

    public List<VisitDTO> getAllVisits() {
        List<VisitDTO> visitDTOS = new ArrayList<>();
        List<Visit> visits = visitRepository.findAll(new Specification<Visit>() {
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
                criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(root.get("dateVisitEnd").as(LocalDate.class),
                        CustomDateTimeFormat.LocalDateByFormat(LocalDate.now(),"yyyy-MM-dd")));
                criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        });
        visits.forEach(visit -> {
            Patient patient = visit.getPatientByVisit();
            List<AppointmentDTO> appointmentDTOS = appointmentService.getOpenAllAppointmentByPatientId(patient.getId());

            VisitDTO visitDTO = visitMapper.toVisitDTO(visit,patient);
            visitDTO.setAppointmentDTOList(appointmentDTOS);
            visitDTOS.add(visitDTO);
        });
        return visitDTOS;
    }

    public Visit save(VisitDTO visitDTO) {
        Optional<Visit> visitOptional = this.visitRepository.findDistinctFirstByPatientIdAndDateVisitEndAndOrganisationUnitId(visitDTO.getPatientId(), null, getOrganisationUnitId());
        if(visitOptional.isPresent())throw new RecordExistException(Visit.class, "Patient", "Still checked In" + ", Visit Start Date =" + visitDTO.getDateVisitStart());

        Visit visit = visitMapper.toVisit(visitDTO);
        visit.setUuid(UUID.randomUUID().toString());
        visit.setOrganisationUnitId(getOrganisationUnitId());

        final Visit savedVisit = visitRepository.save(visit);

        if(visitDTO.getAppointmentId()!= null){
            Optional<Appointment> optionalAppointment = appointmentRepository.findByIdAndArchived(visitDTO.getAppointmentId(), UNARCHIVED);
            optionalAppointment.ifPresent(appointment -> {
                appointment.setVisitId(savedVisit.getId());
                appointmentRepository.save(appointment);
            });
        }
        return savedVisit;
    }

    public VisitDTO getVisit(Long id) {
        Optional<Visit> visitOptional = this.visitRepository.findByIdAndArchivedAndOrganisationUnitId(id, UNARCHIVED, getOrganisationUnitId());

        if (!visitOptional.isPresent()) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        Patient patient = visitOptional.get().getPatientByVisit();
        List<AppointmentDTO> appointmentDTOS = appointmentService.getOpenAllAppointmentByPatientId(patient.getId());

        VisitDTO visitDTO = visitMapper.toVisitDTO(visitOptional.get(), patient);
        visitDTO.setAppointmentDTOList(appointmentDTOS);
        return visitDTO;
    }

    public Visit update(Long id, VisitDTO visitDTO) {
        Optional<Visit> visitOptional = this.visitRepository.findByIdAndArchivedAndOrganisationUnitId(id, UNARCHIVED, getOrganisationUnitId());
        if (!visitOptional.isPresent()) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        Visit visit = visitMapper.toVisit(visitDTO);
        visit.setId(id);
        return visitRepository.save(visit);
    }

    public Integer delete(Long id) {
        Optional<Visit> visitOptional = this.visitRepository.findByIdAndArchivedAndOrganisationUnitId(id, UNARCHIVED, getOrganisationUnitId());
        if (!visitOptional.isPresent()) throw new EntityNotFoundException(Visit.class, "Id", id + "");
        visitOptional.get().setArchived(ARCHIVED);
        return visitOptional.get().getArchived();
    }

    public Long getVisitType(){
        //Todo find by uuid code...
        Long count = visitRepository.countByVisitTypeIdAndArchivedAndOrganisationUnitId(239L, UNARCHIVED, getOrganisationUnitId());//Unbooked
        count = count + visitRepository.countByVisitTypeIdAndArchivedAndOrganisationUnitId(238L, UNARCHIVED, getOrganisationUnitId()); //booked
        count = count + visitRepository.countByVisitTypeIdAndArchivedAndOrganisationUnitId(373L, UNARCHIVED, getOrganisationUnitId()); //Emergency

        return count;
    }

    private Long getOrganisationUnitId(){
        return userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
    }
}