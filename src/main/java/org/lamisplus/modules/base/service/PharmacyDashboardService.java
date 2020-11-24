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
    private final ChartUtil chartUtil;
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();


    public Object getPharmacyPieChart() {
        clearChartList();
        String type = "pie";
        String chartTitle = "TOTAL PRESCRIPTIONS AND DISPENSED DRUGS IN LAST 7 DAYS";
        String name = "FOR FACILITY";
        List prescribed = new ArrayList<>();
        List<Object> data = new ArrayList<Object>();
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
        List<Object> prescribedData = new ArrayList<Object>();

        prescribedData.add(10);
        prescribedData.add(15);
        prescribedData.add(23);
        prescribedData.add(50);
        prescribedData.add(23);
        prescribedData.add(89);
        columnSeries.add(chartUtil.getMainMap(prescribedData, "Prescribed", null, null, null));

        List<Object> dispensedData = new ArrayList<Object>();

        dispensedData.add(45);
        dispensedData.add(479);
        dispensedData.add(23);
        dispensedData.add(45);
        dispensedData.add(23);
        dispensedData.add(45);
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
