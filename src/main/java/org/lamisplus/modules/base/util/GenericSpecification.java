package org.lamisplus.modules.base.util;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Component
public class GenericSpecification<T>  {

    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private static final int ACTIVE = 1;
    public static final int DEACTIVATE = 2;

    public Specification<T> findAll(int active) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), UN_ARCHIVED)));
            if(active != 0){
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("active"), ACTIVE)));
            }
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllModules(int status, int moduleType) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("moduleType"), moduleType)));
            if(status > 0) {
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("status"), status)));
            }
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllPrograms() {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.notEqual(root.get("archived"), ARCHIVED)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllWithOrganisation(Long organisationUnitId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), UN_ARCHIVED)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("organisationUnitId"), organisationUnitId)));

            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllVisitByPatientIdAndVisitDate(Optional<Long> patientId, Optional<String> dateStart, Optional<String> dateEnd) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (patientId.isPresent()) {
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("patientId").as(Long.class), patientId.get())));
            }
            if (dateStart.isPresent() && !dateStart.get().equals("{dateStart}")) {
                predicates.add(getPredicate(root, criteriaBuilder,"dateVisitStart", dateStart, "greaterThanOrEqualTo"));
            }
            if (dateEnd.isPresent() && !dateEnd.get().equals("{dateEnd}")) {
                predicates.add(getPredicate(root, criteriaBuilder,"dateVisitStart", dateEnd, "lessThanOrEqualTo"));
            }
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("dateVisitStart")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };

    }

    public Specification<T> findAllEncountersByPatientIdAndDateEncounter(Long patientId, String formCode, Optional<String> dateStart, Optional<String> dateEnd, Long organisationUnitId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(dateStart.isPresent()&& !dateStart.get().equals("{dateStart}")){
                predicates.add(getPredicate(root, criteriaBuilder,"dateEncounter", dateStart, "greaterThanOrEqualTo"));
            }
            if(dateEnd.isPresent() && !dateEnd.get().equals("{dateEnd}")){
                predicates.add(getPredicate(root, criteriaBuilder,"dateEncounter", dateEnd,"lessThanOrEqualTo"));
            }
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("patientId"), patientId)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("organisationUnitId"), organisationUnitId)));

            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("formCode"), formCode)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("dateEncounter")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllEncounterByPatientIdDesc(Long patientId, Long organisationUnitId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("patientId"), patientId)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("organisationUnitId"), organisationUnitId)));

            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("dateEncounter")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

        private Predicate getPredicate(Root root, CriteriaBuilder criteriaBuilder, String entityField, Optional<String> date, String operation){
        LocalDate localDate = LocalDate.parse(date.get(), DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        if(operation.equals("greaterThanOrEqualTo")) {
            return criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get(entityField).as(LocalDate.class), localDate));
        }else {
            return criteriaBuilder.and(criteriaBuilder.lessThanOrEqualTo(root.get(entityField).as(LocalDate.class), localDate));
        }
    }
}
