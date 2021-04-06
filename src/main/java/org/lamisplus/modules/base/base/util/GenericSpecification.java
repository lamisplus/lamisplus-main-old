package org.lamisplus.modules.base.base.util;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Component
public class GenericSpecification<T>  {

    private static final int UN_ARCHIVED = 0;
    private static final int ACTIVE = 1;

    public Specification<T> findAll() {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllDistinctBy(String attributeName) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            //predicates.add(criteriaBuilder.equal(root.get("archived"), UN_ARCHIVED));
            criteriaBuilder.createQuery().select(root.get(attributeName)).distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllModules(int status, int moduleType) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("moduleType"), moduleType)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("status"), status)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public Specification<T> findAllApplicationCodeset() {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), UN_ARCHIVED)));
            predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("active"), ACTIVE)));
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }
}
