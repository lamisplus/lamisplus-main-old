package org.lamisplus.modules.base.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.base.domain.entity.Country;
import org.lamisplus.modules.base.base.domain.entity.State;
import org.lamisplus.modules.base.base.service.CountryServices;
import org.lamisplus.modules.base.base.domain.dto.HeaderUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;


@RestController
@RequestMapping("/api/countries")
@Slf4j
@RequiredArgsConstructor
public class CountryController {

    private final CountryServices countryServices;
    private static final String ENTITY_NAME = "Country";

    @PostMapping
    public ResponseEntity<Country> save(@RequestBody Country country) throws URISyntaxException {
        Country result = countryServices.save(country);
        return ResponseEntity.created(new URI("/api/countries/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId()))).body(result);
    }

    @PutMapping("{id}")
    public ResponseEntity<Country> update(@PathVariable Long id, @RequestBody Country country) throws URISyntaxException {
        Country result = countryServices.update(id, country);
        return ResponseEntity.created(new URI("/api/countries/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, String.valueOf(result.getId())))
                .body(result);
    }

    @GetMapping
    public ResponseEntity<List<Country>> getAllCountries() {
        return ResponseEntity.ok(countryServices.getAllCountries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Country> getCountry(@PathVariable Long id) {
        return ResponseEntity.ok(countryServices.getCountry(id));
    }

    @GetMapping("/{id}/states")
    public ResponseEntity<List<State>> getStatesByCountryId(@PathVariable Long id) {
        return ResponseEntity.ok(countryServices.getStatesByCountryId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.countryServices.delete(id));
    }
}
