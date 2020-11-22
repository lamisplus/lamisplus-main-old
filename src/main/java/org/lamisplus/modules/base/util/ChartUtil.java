package org.lamisplus.modules.base.util;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Data
public class ChartUtil {
    private Map<String, List> xAxis = new HashMap();
    private Map<String, Object> yAxis = new HashMap();
    private Map<String, Object> yAxisTitle = new HashMap();

    public List<String> setCategories(){
        List<String> months = new ArrayList<>();
        for(int i = 5; i > -1; i--) {
            if(i == 0){
                months.add(LocalDate.now().getMonth().toString());
                continue;
            }
            months.add(LocalDate.now().minusMonths(i).getMonth().toString());
        }
        return months;
    }

    public void setXAxis(List<String> category) {
        xAxis.put("categories", category);
    }

    public Map<String, List> getXAxis() {
        if(xAxis.isEmpty() || xAxis == null){
            setXAxis(setCategories());
        }
        return xAxis;
    }

    public void setYAxis() {
        yAxisTitle.put("text", "Values");
        yAxis.put("title", yAxisTitle);
    }

    public Map<String, Object> getYAxis() {
        if(yAxis.isEmpty() || yAxis == null){
            setYAxis();
        }
        return yAxis;
    }

    public Map<String, Object> getMainMap(List<Object> data, String name, String stack, String type, String title){
        Map<String, Object> mainMap = new HashMap<>();
        mainMap.put("data", data);
        if(name != null){
            mainMap.put("data", data);
        }
        mainMap.put("name", name);
        if(stack != null){
            mainMap.put("stack", stack);
        }
        if(type != null){
            mainMap.put("type", type);
        }
        if(title != null){
            mainMap.put("title", title);
        }
        return mainMap;
    }

    public Map<String, Object> buildMainMap(String type, String chartTitle, String subTitle,
                                            Map<String, List> xAxis, Map<String, Object> yAxis,
                                            List<Object> columnSeries, Map<String, Object> mapColumnSeries){
        Map<String, Object> mainMap = new HashMap<>();
        mainMap.put("type", type);
        mainMap.put("text", chartTitle);
        mainMap.put("subTitle", subTitle);
        mainMap.put("xAxis", xAxis);
        mainMap.put("yAxis", yAxis);
        if(columnSeries != null && mapColumnSeries == null) {
            mainMap.put("series", columnSeries);
        } else if(mapColumnSeries != null && columnSeries == null) {
            mainMap.put("series", mapColumnSeries);
        }
        return mainMap;
    }

    private void clearChartList() {
/*        series.clear();
        data.clear();
        data.clear();*/
        xAxis.clear();
        yAxis.clear();
        yAxisTitle.clear();
        //columnSeries.clear();
    }
}
