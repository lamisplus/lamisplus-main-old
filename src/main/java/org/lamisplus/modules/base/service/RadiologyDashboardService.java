package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.repository.FormDataRepository;
import org.lamisplus.modules.base.util.ChartUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class RadiologyDashboardService {
    private final List<Map<String, Object>> series;
    private final ChartUtil chartUtil;
    private Map<String, List> xAxis = new HashMap();
    private Map<String, Object> yAxis = new HashMap();
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();
    private final List<Object> data = new ArrayList<Object>();
    private final UserService userService;
    private final FormDataRepository formDataRepository;


    public Object getRadiologyPieChart() {
        clearChartList();
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();

        clearChartList();
        String type = "pie";
        String chartTitle = "6 MONTHS RADIOLGY TEST GROUP ANALYSIS";
        String name = "FOR" + organisationUnitName.toUpperCase() +"FACILITY";
        List chest = new ArrayList();
        List<Object> data = new ArrayList<Object>();
        chest.add("chest");
        //chest, head, face and abdomen
        // then others

        chest.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "chest", currentMonth.minusMonths(6), currentMonth));

        List head = new ArrayList();
        head.add("head");
        head.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "head", currentMonth.minusMonths(6), currentMonth));

        List face = new ArrayList();
        face.add("face");
        face.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "face", currentMonth.minusMonths(6), currentMonth));

        List abdomen = new ArrayList();
        abdomen.add("abdomen");
        abdomen.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "abdomen", currentMonth.minusMonths(6), currentMonth));

        List others = new ArrayList();
        List<String> labTestNames = new ArrayList<>();
        labTestNames.add("chest");
        labTestNames.add("head");
        labTestNames.add("face");
        labTestNames.add("abdomen");

        others.add("others");
        others.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameNotInAndDateBetween(organisationUnitId, labTestNames, currentMonth.minusMonths(6), currentMonth));
        data.add(chest);
        data.add(head);
        data.add(face);
        data.add(abdomen);
        data.add(others);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getRadiologyTestOrderStackedColumnChart() {
        clearChartList();
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();

        List<Object> testOrderedData = new ArrayList<Object>();
        List<Object> resultAvailableData = new ArrayList<Object>();

        String type = "column";
        String chartTitle = "RADIOLOGY TEST ORDER/ RESULT ";
        String subTitle = organisationUnitName +" Facilities";
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();


        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId,currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId,currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId, currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestEqualAndDateBetween(organisationUnitId, currentMonth.minusMonths(1), currentMonth));
        columnSeries.add(chartUtil.getMainMap(testOrderedData, "Radiology Test Ordered", "test", null, null));

        try {
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestOrderStatusEqualAndDateBetween(organisationUnitId, "%2%", currentMonth.minusMonths(1), currentMonth));
            columnSeries.add(chartUtil.getMainMap(resultAvailableData, "Radiology Result Available", "result", null, null));
        }catch (Exception e){
            e.printStackTrace();
        }
        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    private void clearChartList() {
        series.clear();
        data.clear();
        data.clear();
        xAxis.clear();
        yAxis.clear();
        yAxisTitle.clear();
        columnSeries.clear();
    }
}