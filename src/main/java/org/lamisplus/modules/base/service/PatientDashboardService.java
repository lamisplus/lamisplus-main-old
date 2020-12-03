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
public class PatientDashboardService {
    private final List<Map<String, Object>> series;
    private final ChartUtil chartUtil;
    private Map<String, List> xAxis = new HashMap();
    private Map<String, Object> yAxis = new HashMap();
    private Map<String, Object> yAxisTitle = new HashMap();


    public Object getPieChart() {
        clearChartList();

        String type = "pie";
        String chartTitle = "TOTAL REGISTERED PATIENTS (MALE AND FEMALE)  In The Last 4 Months";
        String name = "TOTAL REGISTERED PATIENTS (MALE AND FEMALE)";
        List<Object> pediatrics = new ArrayList<>();
        List<Object> data = new ArrayList<Object>();
        pediatrics.add("pediatrics");
        pediatrics.add(48);

        List<Object> male = new ArrayList<>();
        male.add("male");
        male.add(12);

        List<Object> female = new ArrayList<>();
        female.add("female");
        female.add(9);

        data.add(pediatrics);
        data.add(male);
        data.add(female);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "Total Appointment | Attendance | Emergencies";
        String subTitle = "For Facilities";
        List<Object> columnSeries = new ArrayList<>();
        List<Object> appointmentData = new ArrayList<Object>();
        appointmentData.add(23);
        appointmentData.add(45);
        appointmentData.add(23);
        appointmentData.add(50);
        appointmentData.add(23);
        appointmentData.add(89);
        columnSeries.add(chartUtil.getMainMap(appointmentData, "Appointment", null, null, null));

        List<Object> attendanceData = new ArrayList<Object>();
        attendanceData.add(5);
        attendanceData.add(9);
        attendanceData.add(30);
        attendanceData.add(5);
        attendanceData.add(23);
        attendanceData.add(45);
        columnSeries.add(chartUtil.getMainMap(attendanceData, "Attendance", null, null, null));

        List<Object> emergenciesData = new ArrayList<Object>();
        emergenciesData.add(60);
        emergenciesData.add(19);
        emergenciesData.add(23);
        emergenciesData.add(45);
        emergenciesData.add(23);
        emergenciesData.add(45);
        columnSeries.add(chartUtil.getMainMap(emergenciesData, "Emergencies", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    public Object getBirthRateColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "Total Birth Rate for the pass 6 months";
        String subTitle = "For Facilities";
        List<Object> data = new ArrayList<Object>();
        data.add(8);
        data.add(10);
        data.add(23);
        data.add(50);
        data.add(12);
        data.add(89);

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), null,
                chartUtil.getMainMap(data, "Birth Rate", null, null, null));
    }

    public Object getDeathRateColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "Total Death Rate for the pass 6 months";
        String subTitle = "For Facilities";
        List<Object> data = new ArrayList<Object>();

        data.add(18);
        data.add(30);
        data.add(20);
        data.add(5);
        data.add(2);
        data.add(89);

        //columnSeries.add(chartUtil.getMainMap(data, "Death Rate", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), null,
                chartUtil.getMainMap(data, "Death Rate", null, null, null));

    }


    private void clearChartList() {
        series.clear();
        xAxis.clear();
        yAxis.clear();
        yAxisTitle.clear();
    }
}
