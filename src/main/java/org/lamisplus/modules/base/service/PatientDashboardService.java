package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.repository.AppointmentRepository;
import org.lamisplus.modules.base.repository.PatientRepository;
import org.lamisplus.modules.base.repository.VisitRepository;
import org.lamisplus.modules.base.util.ChartUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
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
    private final UserService userService;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final VisitRepository visitRepository;



    public Object getPieChart() {
        LocalDate now = LocalDate.now();
        LocalDate range = now.minusYears(18);
        LocalDate dateTo = LocalDate.now().plusMonths(4);
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();

        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();
        Long maleCount = patientRepository.countByGender("%male", userService.getUserWithRoles().get().getCurrentOrganisationUnitId(), 0, currentMonth.minusMonths(4), currentMonth);
        Long femaleCount = patientRepository.countByGender("%female", userService.getUserWithRoles().get().getCurrentOrganisationUnitId(), 0, currentMonth.minusMonths(4), currentMonth);
        Long pediatricsCount = 0L;
        try {
            pediatricsCount = patientRepository.countByPediatrics(userService.getUserWithRoles().get().getCurrentOrganisationUnitId(), 0, range, now);
        }catch (Exception e){
            e.printStackTrace();
        }
        clearChartList();

        String type = "pie";
        String chartTitle = "TOTAL REGISTERED PATIENTS (MALE AND FEMALE) in " + organisationUnitName.toUpperCase() + " (4 Months)";
        String name = "TOTAL REGISTERED PATIENTS (MALE AND FEMALE) in " + organisationUnitName.toUpperCase();
        List<Object> pediatrics = new ArrayList<>();
        List<Object> data = new ArrayList<Object>();
        pediatrics.add("pediatrics");
        pediatrics.add(pediatricsCount);

        List<Object> male = new ArrayList<>();
        male.add("male");
        male.add(maleCount);

        List<Object> female = new ArrayList<>();
        female.add("female");
        female.add(femaleCount);

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
        LocalDate currentMonth = YearMonth.now().atEndOfMonth();
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();


        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, currentMonth.minusMonths(1), currentMonth));

        columnSeries.add(chartUtil.getMainMap(appointmentData, "Appointment", null, null, null));

        List<Object> attendanceData = new ArrayList<Object>();
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, currentMonth.minusMonths(1), currentMonth));
        columnSeries.add(chartUtil.getMainMap(attendanceData, "Attendance", null, null, null));

        List<Object> emergenciesData = new ArrayList<Object>();
        Long visitTypeId = 373L;
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(6), currentMonth.minusMonths(5)));
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(5), currentMonth.minusMonths(4)));
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(4), currentMonth.minusMonths(3)));
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(3), currentMonth.minusMonths(2)));
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(2), currentMonth.minusMonths(1)));
        emergenciesData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndVisitTypeIdAndDateVisitStartBetween(organisationUnitId,0, visitTypeId, currentMonth.minusMonths(1), currentMonth));
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
