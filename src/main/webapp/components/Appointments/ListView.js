import React, { useState } from "react";
import MaterialTable from "material-table";
import * as _ from "lodash";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";

import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
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
          icons={tableIcons}
        title="Find Appointments"
        columns={[
          { title: "Patient", field: "fullInfo", filtering: true },
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
            {
                title: "Status",
                field: "visitStatus",
                filtering: true,
            },
        ]}
        isLoading={props.loading}
        data={props.appointments.map((row) => ({
          name: row.details ? row.details.firstName + " " + row.details.lastName : "",
          fullInfo: (row.details ? row.details.firstName + " " + row.details.lastName : "" ) + " (" +row.hospitalNumber+")",
          id: row.details && row.details.hospitalNumber ? row.details.hospitalNumber : "",
          phoneNumber: row.details && row.details.phoneNumber ? row.details.phoneNumber : "",
          service: row.detail.service && row.detail.service.name ? row.detail.service.name : '',
            serviceProvider: row.detail.service_provider || '',
          appointmentDate: row.detail.appointment_date ,
          appointmentTime: row.detail.appointment_time ,
          patientId: row.patientId,
          visitId: row.visitId,
            visitStatus: row.visitId ? 'Closed' : 'Open',
          appointmentId: row.id,
            detail: row.detail
        }))}
        actions={[
          {
            icon: VisibilityIcon,
            iconProps: { color: "primary" },
            tooltip: "View Appointment",
            onClick: (event, rowData) =>
              props.viewAppointment(
                rowData.patientId,
                rowData.appointmentId,
                rowData.detail
              ),
          },
          {
            icon: EditIcon,
            iconProps: { color: "primary" },
            tooltip: "Edit Appointment",
            onClick: (event, rowData) =>
                props.editAppointment(
                    rowData.patientId,
                    rowData.appointmentId,
                    rowData.detail
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
