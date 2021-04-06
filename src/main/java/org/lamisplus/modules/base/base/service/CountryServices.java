package org.lamisplus.modules.base.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.base.domain.entity.Country;
import org.lamisplus.modules.base.base.domain.entity.State;
import org.lamisplus.modules.base.base.repository.CountriesRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CountryServices {
    private final CountriesRepository countryRepository;

    public Country save(Country country) {
        Optional<Country> country1 = countryRepository.findById(country.getId());
        if(country1.isPresent())throw new RecordExistException(Country.class, "Id", country.getId() +"");
        return countryRepository.save(country);
    }

    public Country update(Long id, Country country) {
        Optional<Country> country1 = countryRepository.findById(id);
        if(!country1.isPresent())throw new EntityNotFoundException(Country.class, "Id", id +"");
        country.setId(id);
        return countryRepository.save(country);
    }
    public Country getCountry(Long id){
        Optional<Country> country = this.countryRepository.findById(id);
        if (!country.isPresent())throw new EntityNotFoundException(Country.class, "Id", id +"");
        return country.get();
    }

    public List<Country> getAllCountries() {
        List<Country> countryList = countryRepository.findAll(new Specification<Country>(){
            @Override
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(criteriaBuilder.and(criteriaBuilder.equal(root.get("archived"), 0)));
                criteriaQuery.orderBy(criteriaBuilder.asc(root.get("name")));
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        });

        return countryList;
    }

    public List<State> getStatesByCountryId(Long id){
        Country country = countryRepository.getOne(id);
        List<State> stateList = country.getStatesByCountry().stream()
                .sorted(Comparator.comparing(State::getName))
                .collect(Collectors.toList());
        return stateList;
    }

    public Integer delete(Long id){
        Optional<Country> countryOptional = this.countryRepository.findById(id);
        if (!countryOptional.isPresent())throw new EntityNotFoundException(Country.class, "Id", id +"");
        countryOptional.get().setArchived(1);
        return countryOptional.get().getArchived();
    }
}
