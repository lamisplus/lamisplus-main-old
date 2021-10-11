import React from 'react';
import {Button} from 'reactstrap'
import FormRenderer from 'components/FormManager/FormRenderer';
import {connect} from 'react-redux';

function FormRendererPage(props) {
    const form = props.location.state.form.row;
    return (
        <div>
            <Button color="primary" className=" float-right mr-1" onClick={props.history.goBack} >
                Go Back
                </Button>
            <FormRenderer patientId={props.patient.patientId} formId={form.id} serviceName={form.programCode} visitId={props.patient.visitId}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      patient: state.patients.patient
    }
  }
  
  export default connect(mapStateToProps, {})(FormRendererPage)
  