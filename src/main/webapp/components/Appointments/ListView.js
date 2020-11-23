import React, { useState } from "react";
import MaterialTable from "material-table";
import * as _ from "lodash";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";


//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function ListViewPage(props) {

  React.useEffect(() => {
    props.fetchAppointments();
  }, []);

  //custom filter for appointment date on the table
  const filterDate = (value, rowData) => {
    if (value) {
      if (value.to && value.from) {
        return (
          new Date(rowData.appointmentDate) <= new Date(value.to) &&
          new Date(rowData.appointmentDate) >= new Date(value.from)
        );
      }
      if (value.from) {
        return new Date(rowData.appointmentDate) >= new Date(value.from);
      }
      if (value.to) {
        return new Date(rowData.appointmentDate) <= new Date(value.to);
      }

      return null;
    }
  };
  return (
    <React.Fragment>
      <MaterialTable
        title="Find Appointments"
        columns={[
          { title: "Patient ID", field: "id", filtering: true },
          {
            title: "Patient Name",
            field: "name",
            filtering: true,
          },

          {
            title: "Appointment Date",
            field: "appointmentDate",
            type: "date",
            filterComponent: FilterDateBetween,
            customFilterAndSearch: (term, rowData) => filterDate(term, rowData),
          },
          {
            title: "Appointment Time",
            field: "appointmentTime",
            type: "time",
          },
          { title: "Service", field: "service", filtering: true },
            { title: "Service Provider", field: "serviceProvider", filtering: true },
        ]}
        isLoading={props.loading}
        data={props.appointments.map((row) => ({
          name: row.firstName + " " + row.lastName,
          id: row.hospitalNumber,
          phoneNumber: row.phoneNumber,
          service: row.formDataObj[0].data.service && row.formDataObj[0].data.service.name ? row.formDataObj[0].data.service.name : '',
            serviceProvider: row.formDataObj[0].data.service_provider || '',
          appointmentDate: row.formDataObj[0].data.appointment_date ,
          appointmentTime: row.formDataObj[0].data.appointment_time ,
          patientId: row.patientId,
          visitId: row.visitId,
          encounterId: row.encounterId,
        }))}
        actions={[
          {
            icon: "visibility",
            iconProps: { color: "primary" },
            tooltip: "View Appointment",
            onClick: (event, rowData) =>
              props.viewAppointment(
                rowData.patientId,
                rowData.visitId,
                rowData.encounterId
              ),
          },
          {
            icon: "edit",
            iconProps: { color: "primary" },
            tooltip: "Edit Appointment",
            onClick: (event, rowData) =>
                props.editAppointment(
                    rowData.patientId,
                    rowData.visitId,
                    rowData.encounterId
                ),
          },
        ]}
        options={{
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
          },
          searchFieldStyle: {
            width: "300%",
            margingLeft: "250px",
          },
          filtering: true,
          exportButton: false,
          searchFieldAlignment: "left",
          actionsColumnIndex: -1,
        }}
      />

    </React.Fragment>
  );
}

function FilterDateBetween({ columnDef, onFilterChanged }) {
  return (
    <>
      <DateTimePicker
        time={false}
        name="from"
        placeholder="From"
        value={_.get(columnDef, ["tableData", "filterValue", "from"]) || null}
        onChange={(event) => {
          const value = { ...columnDef.tableData.filterValue };
          value.from = event;
          onFilterChanged(columnDef.tableData.id, value);
        }}
      />
      <br></br>
      <DateTimePicker
        time={false}
        name="to"
        placeholder="To"
        value={_.get(columnDef, ["tableData", "filterValue", "to"]) || null}
        onChange={(event) => {
          const value = { ...columnDef.tableData.filterValue };
          value.to = event;
          onFilterChanged(columnDef.tableData.id, value);
        }}
      />
      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd"
          margin="dense"
         // id="date-picker-inline"
          label="Appointments From:"
          value={_.get(columnDef, ['tableData', 'filterValue', 'greaterThan']) || null }
          onChange={(event) => {
            const value = {...columnDef.tableData.filterValue};
            value.greaterThan = event;
            onFilterChanged(columnDef.tableData.id, value);
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
         format="yyyy-MM-dd"
          margin="dense"
         // id="date-picker-inline"
          label="Appointments To:"
          value={_.get(columnDef, ['tableData', 'filterValue', 'lessThan']) || null }
          onChange={(event) => {
            const value = {...columnDef.tableData.filterValue};
            value.lessThan = event;
            console.log(value);
            onFilterChanged(columnDef.tableData.id, value);
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider> */}
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    appointments: state.appointments.list,
  };
};

const mapActionToProps = {

};

export default connect(mapStateToProps, mapActionToProps)(ListViewPage);
