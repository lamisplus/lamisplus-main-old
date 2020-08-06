package org.lamisplus.modules.base.util;

import org.lamisplus.modules.base.domain.entity.Icd;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class GenericSpecification<T>  {

    public Specification<T> findAll() {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllDistinct(String field) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
            criteriaQuery.select(root.get(field)).distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }
}
