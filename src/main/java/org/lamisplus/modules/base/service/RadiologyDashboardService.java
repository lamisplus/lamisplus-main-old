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
        List chemistry = new ArrayList();
        List<Object> data = new ArrayList<Object>();
        String LabTestName = "Chemistry";
        chemistry.add(LabTestName);
        //chest, head, face and abdomen
        // then others

        chemistry.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, LabTestName, currentMonth.minusMonths(6), currentMonth));

        List biochemistry = new ArrayList();
        biochemistry.add("Chest");
        biochemistry.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "Biochemistry", currentMonth.minusMonths(6), currentMonth));

        List haematology = new ArrayList();
        haematology.add("Head");
        haematology.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "Haematology", currentMonth.minusMonths(6), currentMonth));

        List microbiology = new ArrayList();
        microbiology.add("Face");
        microbiology.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "Microbiology", currentMonth.minusMonths(6), currentMonth));

        List virology = new ArrayList();
        virology.add("Abdomen");
        virology.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "Virology", currentMonth.minusMonths(6), currentMonth));

        List others = new ArrayList();
        List<String> labTestNames = new ArrayList<>();
        labTestNames.add("Biochemistry");
        labTestNames.add("Haematology");
        labTestNames.add("Microbiology");
        labTestNames.add("Virology");

        others.add("Others");
        others.add(formDataRepository.countAllByOrganisationUnitIdAndRadiologyTestNameAndDateBetween(organisationUnitId, "Others", currentMonth.minusMonths(6), currentMonth));
        data.add(chemistry);
        data.add(biochemistry);
        data.add(haematology);
        data.add(microbiology);
        data.add(virology);
        data.add(others);

        return chartUtil.getMainMap(data, name, null, type, chartTitle);
    }

    public Object getRadiologyTestOrderStackedColumnChart() {
        clearChartList();
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();

        List<Object> testOrderedData = new ArrayList<Object>();
        List<Object> resultAvailableData = new ArrayList<Object>();
        //List<Object> radiologyTestOrderedData = new ArrayList<Object>();
        //List<Object> radiologyResultAvailableData = new ArrayList<Object>();
        String type = "column";
        String chartTitle = "RADIOLOGY TEST ORDER/ RESULT";
        String subTitle = organisationUnitName +" Facilities";
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();


        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId,currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId,currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId, currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        testOrderedData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestAndDateBetween(organisationUnitId, currentMonth.minusMonths(1), currentMonth));
        columnSeries.add(chartUtil.getMainMap(testOrderedData, "Radiology Test Ordered", "test", null, null));

        try {
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
            resultAvailableData.add(formDataRepository.countAllByOrganisationUnitIdAndLabTestEqualAndDateBetween(organisationUnitId, "%5%", currentMonth.minusMonths(1), currentMonth));
            columnSeries.add(chartUtil.getMainMap(resultAvailableData, "Radiology Result Available", "result", null, null));
        }catch (Exception e){
            e.printStackTrace();
        }
        /*radiologyTestOrderedData.add(45);
        radiologyTestOrderedData.add(7);
        radiologyTestOrderedData.add(23);
        radiologyTestOrderedData.add(4);
        radiologyTestOrderedData.add(3);
        radiologyTestOrderedData.add(4);
        columnSeries.add(chartUtil.getMainMap(radiologyTestOrderedData, "Radiology Test Orders", "test", null, null));
*/
        /*radiologyResultAvailableData.add(60);
        radiologyResultAvailableData.add(19);
        radiologyResultAvailableData.add(23);
        radiologyResultAvailableData.add(45);
        radiologyResultAvailableData.add(23);
        radiologyResultAvailableData.add(45);
        columnSeries.add(chartUtil.getMainMap(radiologyResultAvailableData, "Radiology Test Available", "result", null, null));
*/
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