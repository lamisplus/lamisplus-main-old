import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAll, Delete as Del , fetchCheckedInPatients} from "../../actions/patients";
import "./PatientSearch.css";
import { Dashboard } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';

const ActivePatientSearch = (props) => {
  const [loading, setLoading] = React.useState(true);

      useEffect(() => {
        const onSuccess = () => {
          setLoading(false);
        };
        const onError = () => {
          setLoading(false);
        };
        props.fetchAllPatients(onSuccess, onError);
      }, []); //componentDidMount

      const calculate_age = dob => {
        var today = new Date();
        var dateParts = dob.split("-");
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        var birthDate = new Date(dateObject); // create a date object directly from `dob1` argument
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age_now--;
        }
      
        if (age_now === 0) {
          return m + " month(s)";
        }
        return age_now + " year(s)";
      };

    
  return (
    <div>
      <MaterialTable
        title="Find Checked-In Patients"
        columns={[
          {
            title: "Patient Name",
            field: "name",
          },
          { title: "Patient ID", field: "id" },
          { title: "Age", field: "age", filtering: false },
          { title: "Check-In Time", field: "checkIn", filtering: false }
        ]}
        isLoading={loading}
        data={props.patientsList.map((row) => ({
          name: row.firstName +  ' ' + row.lastName,
          id: row.hospitalNumber,
          age: (row.dob === 0 ||
          row.dob === undefined ||
          row.dob === null ||
          row.dob === "" )
            ? 0
            : calculate_age(row.dob),
          address: row.street || ''  ,
          patientId: row.patientId,
          visitId: row.id,
          checkIn: row.dateVisitStart + ' ' + (row.timeVisitStart ? row.timeVisitStart : '' ) 
        }))}
        
        actions= {[
          {
            icon: 'dashboard',
            iconProps: {color: 'primary'},
            tooltip: 'Patient Dashboard',
            onClick: (event, rowData) => rowData.id ? window.location.href = "/patient-dashboard?hospitalNumber="+rowData.id: ""
          }]}
          //overriding action menu with props.actions 
          components={props.actions}
        options={{
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
          },
          searchFieldStyle: {
            width : '300%',
            margingLeft: '250px',
          },
          filtering: true,
          exportButton: false,
          searchFieldAlignment: 'left',
          actionsColumnIndex: -1
        }}
      />
    </div>
  );
}

const mapStateToProps = state => {

    return {
      patientsList: state.patients.list
      //patientsList: state.patients.checkedInPatientList
    };
  };
  
  const mapActionToProps = {
    //fetchAllPatients: fetchCheckedInPatients,
    fetchAllPatients: fetchAll,
    deletePatient: Del
  };
  
export default connect(mapStateToProps, mapActionToProps)(ActivePatientSearch);