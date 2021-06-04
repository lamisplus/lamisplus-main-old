package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.repository.FormDataRepository;
import org.lamisplus.modules.base.util.ChartUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PharmacyDashboardService {
    private final List<Map<String, Object>> series;
    private final ChartUtil chartUtil;
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();
    private final UserService userService;
    private final FormDataRepository formDataRepository;


    public Object getPharmacyPieChart() {
        clearChartList();
        LocalDate beforeDay = LocalDate.now().minusDays(LocalDate.now().getDayOfWeek().getValue());
        LocalDate now = LocalDate.now();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();

        String type = "pie";
        String chartTitle = "TOTAL PRESCRIPTIONS AND DISPENSED DRUGS IN LAST 7 DAYS";
        String name = "FOR FACILITY "+organisationUnitName.toUpperCase() ;
        List prescribed = new ArrayList<>();
        List<Object> data = new ArrayList<Object>();
        prescribed.add("Prescribed");

        prescribed.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId,beforeDay, now));

        List dispensed = new ArrayList<>();
        dispensed.add("Dispensed");
        dispensed.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId,  beforeDay, now));

        data.add(prescribed);
        data.add(dispensed);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getPharmacyColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "MONTHLY AVERAGE DRUG";
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();

        String subTitle = "For Facilities " + organisationUnitName.toUpperCase();
        List<Object> prescribedData = new ArrayList<Object>();
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();

        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId, currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId, currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId,  currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        prescribedData.add(formDataRepository.countAllByOrganisationUnitIdAndPrescriptionStatusAndDateBetween(organisationUnitId, currentMonth.minusMonths(1), currentMonth));

        columnSeries.add(chartUtil.getMainMap(prescribedData, "Prescribed", null, null, null));

        List<Object> dispensedData = new ArrayList<Object>();

        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId, currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId, currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId,  currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        dispensedData.add(formDataRepository.countAllByOrganisationUnitIdAndDateDispensedAndDateBetween(organisationUnitId, currentMonth.minusMonths(1), currentMonth));

        columnSeries.add(chartUtil.getMainMap(dispensedData, "Dispensed", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    private void clearChartList() {
        series.clear();
        yAxisTitle.clear();
        columnSeries.clear();
    }
}
