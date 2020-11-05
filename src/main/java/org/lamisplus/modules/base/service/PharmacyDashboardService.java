package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.util.ChartUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PharmacyDashboardService {
    private final List<Map<String, Object>> series;
    private final List<Object> data = new ArrayList<Object>();
    private final ChartUtil chartUtil;
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();


    public Object getPharmacyPieChart() {
        clearChartList();
        String type = "pie";
        String chartTitle = "TOTAL PRESCRIPTIONS AND DISPENSED DRUGS IN LAST 7 DAYS";
        String name = "FOR FACILITY";
        List prescribed = new ArrayList<>();
        prescribed.add("Prescribed");
        prescribed.add(48);

        List dispensed = new ArrayList<>();
        dispensed.add("Dispensed");
        dispensed.add(12);

        data.add(prescribed);
        data.add(dispensed);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getPharmacyColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "MONTHLY AVERAGE DRUG";
        String subTitle = "For Facilities";

        data.add(10);
        data.add(15);
        data.add(23);
        data.add(50);
        data.add(23);
        data.add(89);
        columnSeries.add(chartUtil.getMainMap(data, "Prescribed", null, null, null));
        data.clear();

        data.add(45);
        data.add(479);
        data.add(23);
        data.add(45);
        data.add(23);
        data.add(45);
        columnSeries.add(chartUtil.getMainMap(data, "Dispensed", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    private void clearChartList() {
        series.clear();
        data.clear();
        data.clear();
        /*xAxis.clear();
        yAxis.clear();*/
        yAxisTitle.clear();
        columnSeries.clear();
    }
}
