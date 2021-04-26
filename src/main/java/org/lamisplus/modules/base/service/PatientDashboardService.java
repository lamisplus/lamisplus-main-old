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
        String organisationUnitName = userService.getUserWithRoles().get().getOrganisationUnitByCurrentOrganisationUnitId().getName();
        Long maleCount = patientRepository.countByGender("%male", userService.getUserWithRoles().get().getCurrentOrganisationUnitId(), 0, dateTo, now);
        Long femaleCount = patientRepository.countByGender("%female", userService.getUserWithRoles().get().getCurrentOrganisationUnitId(), 0, dateTo, now);
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
        LocalDate from = LocalDate.now();
        Timestamp timestamp = Timestamp.from(Instant.now());
        Long organisationUnitId = userService.getUserWithRoles().get().getCurrentOrganisationUnitId();


        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(6).atStartOfDay()), Timestamp.valueOf(from.minusMonths(5).atStartOfDay())));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(5).atStartOfDay()), Timestamp.valueOf(from.minusMonths(4).atStartOfDay())));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(4).atStartOfDay()), Timestamp.valueOf(from.minusMonths(3).atStartOfDay())));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(3).atStartOfDay()), Timestamp.valueOf(from.minusMonths(2).atStartOfDay())));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(2).atStartOfDay()), Timestamp.valueOf(from.minusMonths(1).atStartOfDay())));
        appointmentData.add(appointmentRepository.countAllByOrganisationUnitIdAndArchivedAndDateBetween(organisationUnitId,0, Timestamp.valueOf(from.minusMonths(1).atStartOfDay()), timestamp));

        columnSeries.add(chartUtil.getMainMap(appointmentData, "Appointment", null, null, null));

        List<Object> attendanceData = new ArrayList<Object>();
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now().minusMonths(5), LocalDate.now().minusMonths(6)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now().minusMonths(4), LocalDate.now().minusMonths(5)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now().minusMonths(3), LocalDate.now().minusMonths(4)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now().minusMonths(2), LocalDate.now().minusMonths(3)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now().minusMonths(1), LocalDate.now().minusMonths(2)));
        attendanceData.add(visitRepository.countAllByOrganisationUnitIdAndArchivedAndDateVisitStartBetween(organisationUnitId,0, LocalDate.now(), LocalDate.now().minusMonths(1)));
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
