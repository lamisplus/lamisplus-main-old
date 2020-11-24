package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.entity.Country;
import org.lamisplus.modules.base.domain.entity.Province;
import org.lamisplus.modules.base.domain.entity.State;
import org.lamisplus.modules.base.repository.ProvinceRepository;
import org.lamisplus.modules.base.repository.StateRepository;
import org.lamisplus.modules.base.repository.CountriesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StateService {
    private final StateRepository stateRepository;
    private final CountriesRepository countryRepository;

    public State save(Long countryId, State state) {
        Optional<Country> country = this.countryRepository.findById(countryId);
        if (!country.isPresent()) throw new EntityNotFoundException(Country.class, "Country Id", countryId + "");
        return this.stateRepository.save(state);
    }
    public State getState(Long id) {
        Optional<State> stateOptional = this.stateRepository.findById(id);
        if(!stateOptional.isPresent() || stateOptional.get().getArchived() == 1) throw new EntityNotFoundException(State.class,"Id:",id+"");
        return stateOptional.get();
    }


    public State update(Long id, State state) {
        Optional<State> stateOptional = stateRepository.findById(id);
        if(!stateOptional.isPresent() || stateOptional.get().getArchived() == 1) throw new EntityNotFoundException(State.class,"Id:",id+"");
        state.setId(id);
        return stateRepository.save(state);
    }

    public List<Province> getProvincesByStateId(Long id) {
        Optional<State> stateOptional = stateRepository.findById(id);
        if(!stateOptional.isPresent() || stateOptional.get().getArchived() == 1) throw new EntityNotFoundException(State.class,"Id:",id+"");

        List<Province> provinceList = stateOptional.get().getProvincesByState().stream()
                .sorted(Comparator.comparing(Province::getName))
                .collect(Collectors.toList());
        return provinceList;
    }

    public Integer delete(Long id) {
        Optional<State> stateOptional = stateRepository.findById(id);
        if(!stateOptional.isPresent() || stateOptional.get().getArchived() == 1) throw new EntityNotFoundException(State.class,"Id:",id+"");
        stateOptional.get().setArchived(1);
        return stateOptional.get().getArchived();
    }

}
