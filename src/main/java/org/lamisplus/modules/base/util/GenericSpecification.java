package org.lamisplus.modules.base.util;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Component
public class GenericSpecification<T>  {

    private static final int UN_ARCHIVED = 0;
    private static final int ACTIVE = 1;

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
}
