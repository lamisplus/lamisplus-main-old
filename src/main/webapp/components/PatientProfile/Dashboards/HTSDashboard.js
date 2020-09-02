import React from 'react';
import {connect} from 'react-redux';
import PatientAllergies from 'components/PatientProfile/PatientDashboardWidgets/PatientAllergies';
import PatientVitals from 'components/PatientProfile/PatientDashboardWidgets/PatientVitals';
import ClinicalHistory from 'components/PatientProfile/PatientDashboardWidgets/ClinicalHistory';
import PatientChart from 'components/PatientProfile/PatientChart';
import {  Card, CardBody, CardDeck} from 'reactstrap';
import './dashboard.css'
import HtsPatientChart from "../PatientDashboardWidgets/hts/HtsPatientChart";
import ArtCommencement from "../PatientDashboardWidgets/hts/ArtCommencement";

function HTSDashboard(props) {
    return (
        <React.Fragment>
            <CardDeck >
         <PatientVitals patientId={props.patientId}  /> 
        <ArtCommencement patientId={props.patientId} />

      </CardDeck>
      <br></br>
    <HtsPatientChart patientId={props.patientId}  />
    <br></br>
     <ClinicalHistory  patientId={props.patientId}/>
        </React.Fragment>
    );

}
const mapStateToProps = (state) => {
    return {
    patient: state.patients.patient,
    }
  }
  
  const mapActionToProps = {
  }
  

  export default connect(mapStateToProps, mapActionToProps)(HTSDashboard)