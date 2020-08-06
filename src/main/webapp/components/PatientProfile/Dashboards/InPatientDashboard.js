import React from 'react';
import {connect} from 'react-redux';
import PatientAllergies from 'components/PatientProfile/PatientDashboardWidgets/PatientAllergies';
import PatientVitals from 'components/PatientProfile/PatientDashboardWidgets/PatientVitals';
import ClinicalHistory from 'components/PatientProfile/PatientDashboardWidgets/ClinicalHistory';
import PatientChart from 'components/PatientProfile/PatientChart';
import {  Card, CardBody, CardDeck} from 'reactstrap';

function InPatientDashboard(props) {
    return (
        <React.Fragment>
            <CardDeck>
         <PatientVitals patientId={props.patientId}  /> 
        <PatientAllergies patientId={props.patientId} /> 
        {/* <PatientVitals patientId={props.patient.patientId}  />  */}
      </CardDeck>
      <br></br>
    <PatientChart patientId={props.patientId}  />
    <br></br>
    <Card>
                        <CardBody>
                            <ClinicalHistory  patientId={props.patientId}/>                     
                        </CardBody>                      
                    </Card>
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
  

  export default connect(mapStateToProps, mapActionToProps)(InPatientDashboard)