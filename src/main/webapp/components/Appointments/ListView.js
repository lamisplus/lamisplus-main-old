import React, { useState } from "react";
import MaterialTable from "material-table";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Tooltip from "@material-ui/core/Tooltip";
import * as _ from "lodash";
import { connect } from "react-redux";
import { fetchAllAppointments } from "actions/appointments";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import FormRendererModal from "components/FormManager/FormRendererModal";
import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function ListViewPage(props) {
  const [loading, setLoading] = useState(false);
  const [showCurrentForm, setShowCurrentForm] = useState(false);
  const [currentForm, setCurrentForm] = useState(false);

  const onSuccess = () => {
    toast.success("Form saved successfully!", { appearance: "success" });
    setShowCurrentForm(false);
  };

  const onError = () => {
    toast.error("Something went wrong, request failed.");
    setShowCurrentForm(false);
  };

  const editAppointment = (patientId, visitId) => {
    setCurrentForm({
      code: CODES.APPOINTMENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "PATIENT APPOINTMENT",
      patientId: patientId,
      visitId: visitId,
      type: "EDIT",
      options: {
        modalSize: "modal-lg",
      },
    });
    setShowCurrentForm(true);
  };

  const viewAppointment = (patientId, visitId, encounterId) => {
    setCurrentForm({
      code: CODES.APPOINTMENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "PATIENT APPOINTMENT",
      patientId: patientId,
      visitId: visitId,
      encounterId: encounterId,
      type: "VIEW",
      options: {
        modalSize: "modal-lg",
      },
    });
    setShowCurrentForm(true);
  };

  React.useEffect(() => {
    setLoading(true);
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
      // setErrorMsg("Could not fetch previous medications, try again later");
    };
    props.fetchAllAppointments(onSuccess, onError);
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
          { title: "Phone Number", field: "phoneNumber", filtering: true },
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
        ]}
        isLoading={loading}
        data={props.appointments.map((row) => ({
          name: row.firstName + " " + row.lastName,
          id: row.hospitalNumber,
          phoneNumber: row.phoneNumber,
          service: row.service || "",
          appointmentDate: row.formDataObj[0].data.appointmentDate,
          appointmentTime: row.formDataObj[0].data.appointmentTime,
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
              viewAppointment(
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
      <ToastContainer />
      <FormRendererModal
        patientId={currentForm.patientId}
        visitId={currentForm.visitId}
        showModal={showCurrentForm}
        setShowModal={setShowCurrentForm}
        currentForm={currentForm}
        onSuccess={onSuccess}
        onError={onError}
        options={currentForm.options}
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
          console.log(value);
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
          console.log(value);
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
  fetchAllAppointments: fetchAllAppointments,
};

export default connect(mapStateToProps, mapActionToProps)(ListViewPage);
