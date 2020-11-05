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
public class LaboratoryDashboardService {
    private final List<Map<String, Object>> series;
    private final List<Object> data = new ArrayList<Object>();
    private final ChartUtil chartUtil;
    private Map<String, List> xAxis = new HashMap();
    private Map<String, Object> yAxis = new HashMap();
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();

    public Object getLaboratoryPieChart() {
        clearChartList();
        String type = "pie";
        String chartTitle = "LABORATORY TEST GROUP ANALYSIS";
        String name = "FOR FACILITY";
        List chemistry = new ArrayList();
        chemistry.add("Chemistry");
        chemistry.add(10);

        List biochemistry = new ArrayList();
        biochemistry.add("Biochemistry");
        biochemistry.add(10);

        List haematology = new ArrayList();
        haematology.add("Haematology");
        haematology.add(10);

        List microbiology = new ArrayList();
        microbiology.add("Microbiology");
        microbiology.add(12);

        List virology = new ArrayList();
        virology.add("Virology");
        virology.add(10);

        Map<String, Object> others = new HashMap();
        others.put("name", "Others");
        others.put("y", 10);

        data.add(chemistry);
        data.add(biochemistry);
        data.add(haematology);
        data.add(microbiology);
        data.add(virology);
        data.add(others);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getLimsColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "LIMS CHART ANALYSIS";
        String subTitle = "For Facilities";

        data.add(10);
        data.add(15);
        data.add(23);
        data.add(50);
        data.add(23);
        data.add(89);
        columnSeries.add(chartUtil.getMainMap(data, "Samples Rejected", null, null, null));
        data.clear();

        data.add(45);
        data.add(49);
        data.add(23);
        data.add(15);
        data.add(23);
        data.add(45);
        columnSeries.add(chartUtil.getMainMap(data, "Samples Dispatched", null, null, null));
        data.clear();

        data.add(60);
        data.add(19);
        data.add(23);
        data.add(45);
        data.add(23);
        data.add(45);
        columnSeries.add(chartUtil.getMainMap(data, "Results Available", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    public Object getLaboratoryTestOrderStackedColumnChart() {
        clearChartList();
        String type = "column";
        String chartTitle = "LABORATORY TEST ORDER/ RESULT";
        String subTitle = "For Facilities";

        data.add(10);
        data.add(15);
        data.add(3);
        data.add(5);
        data.add(2);
        data.add(9);
        columnSeries.add(chartUtil.getMainMap(data, "Test Ordered", "test", null, null));
        data.clear();

        data.add(45);
        data.add(479);
        data.add(23);
        data.add(45);
        data.add(23);
        data.add(45);
        columnSeries.add(chartUtil.getMainMap(data, "Result Available", "result", null, null));
        data.clear();

        data.add(45);
        data.add(7);
        data.add(23);
        data.add(4);
        data.add(3);
        data.add(4);
        columnSeries.add(chartUtil.getMainMap(data, "Radiology Test Orders", "test", null, null));
        data.clear();

        data.add(60);
        data.add(19);
        data.add(23);
        data.add(45);
        data.add(23);
        data.add(45);
        columnSeries.add(chartUtil.getMainMap(data, "Radiology Test Available", "result", null, null));

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
