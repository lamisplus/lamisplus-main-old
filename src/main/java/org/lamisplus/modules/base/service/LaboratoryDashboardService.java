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
    private final ChartUtil chartUtil;
    private Map<String, List> xAxis = new HashMap();
    private Map<String, Object> yAxis = new HashMap();
    private Map<String, Object> yAxisTitle = new HashMap();
    private List<Object> columnSeries = new ArrayList<>();
    private final List<Object> data = new ArrayList<Object>();


    public Object getLaboratoryPieChart() {
        clearChartList();
        String type = "pie";
        String chartTitle = "LABORATORY TEST GROUP ANALYSIS";
        String name = "FOR FACILITY";
        List chemistry = new ArrayList();
        List<Object> data = new ArrayList<Object>();
        chemistry.add("Chemistry");
        chemistry.add(8);

        List biochemistry = new ArrayList();
        biochemistry.add("Biochemistry");
        biochemistry.add(11);

        List haematology = new ArrayList();
        haematology.add("Haematology");
        haematology.add(10);

        List microbiology = new ArrayList();
        microbiology.add("Microbiology");
        microbiology.add(12);

        List virology = new ArrayList();
        virology.add("Virology");
        virology.add(7);

        List others = new ArrayList();
        others.add("Others");
        others.add(4);

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
        List<Object> sampleRejectedData = new ArrayList<Object>();
        List<Object> sampleDispatchedData = new ArrayList<Object>();
        List<Object> resultAvailableData = new ArrayList<Object>();


        sampleRejectedData.add(5);
        sampleRejectedData.add(15);
        sampleRejectedData.add(23);
        sampleRejectedData.add(50);
        sampleRejectedData.add(23);
        sampleRejectedData.add(89);
        columnSeries.add(chartUtil.getMainMap(sampleRejectedData, "Samples Rejected", null, null, null));

        sampleDispatchedData.add(45);
        sampleDispatchedData.add(49);
        sampleDispatchedData.add(23);
        sampleDispatchedData.add(15);
        sampleDispatchedData.add(23);
        sampleDispatchedData.add(45);
        columnSeries.add(chartUtil.getMainMap(sampleDispatchedData, "Samples Dispatched", null, null, null));

        resultAvailableData.add(60);
        resultAvailableData.add(19);
        resultAvailableData.add(23);
        resultAvailableData.add(45);
        resultAvailableData.add(23);
        resultAvailableData.add(45);
        columnSeries.add(chartUtil.getMainMap(resultAvailableData, "Results Available", null, null, null));

        return chartUtil.buildMainMap(type, chartTitle, subTitle, chartUtil.getXAxis(),
                chartUtil.getYAxis(), columnSeries, null);
    }

    public Object getLaboratoryTestOrderStackedColumnChart() {
        List<Object> testOrderedData = new ArrayList<Object>();
        List<Object> resultAvailableData = new ArrayList<Object>();
        List<Object> radiologyTestOrderedData = new ArrayList<Object>();
        List<Object> radiologyResultAvailableData = new ArrayList<Object>();
        String type = "column";
        String chartTitle = "LABORATORY TEST ORDER/ RESULT";
        String subTitle = "For Facilities";

        testOrderedData.add(10);
        testOrderedData.add(15);
        testOrderedData.add(3);
        testOrderedData.add(5);
        testOrderedData.add(2);
        testOrderedData.add(9);
        columnSeries.add(chartUtil.getMainMap(testOrderedData, "Test Ordered", "test", null, null));

        resultAvailableData.add(45);
        resultAvailableData.add(479);
        resultAvailableData.add(23);
        resultAvailableData.add(45);
        resultAvailableData.add(23);
        resultAvailableData.add(45);
        columnSeries.add(chartUtil.getMainMap(resultAvailableData, "Result Available", "result", null, null));

        radiologyTestOrderedData.add(45);
        radiologyTestOrderedData.add(7);
        radiologyTestOrderedData.add(23);
        radiologyTestOrderedData.add(4);
        radiologyTestOrderedData.add(3);
        radiologyTestOrderedData.add(4);
        columnSeries.add(chartUtil.getMainMap(radiologyTestOrderedData, "Radiology Test Orders", "test", null, null));

        radiologyResultAvailableData.add(60);
        radiologyResultAvailableData.add(19);
        radiologyResultAvailableData.add(23);
        radiologyResultAvailableData.add(45);
        radiologyResultAvailableData.add(23);
        radiologyResultAvailableData.add(45);
        columnSeries.add(chartUtil.getMainMap(radiologyResultAvailableData, "Radiology Test Available", "result", null, null));

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
