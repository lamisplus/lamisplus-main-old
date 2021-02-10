import React from "react";
import {
  CardBody,
  CardHeader,
  Col,
  Row,
  Card} from "reactstrap";

import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import * as encounterAction from "actions/encounter";
import { connect } from "react-redux";
import PreviousMedication from "./PreviousMedication";
import {Button} from "semantic-ui-react";
import DrugOrder from "./DrugOrder";
import RegimenOrder from "./RegimenOrder";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const cardStyle = {
  borbderColor: "#fff",
  marginBottom: 10,
};

function MedicationPage(props) {
  const [showDrugOrderForm, setShowDrugOrderForm] = React.useState(true);

//to handle the toggle between the drug and regimen forms
  const handleToggle = () => {
    setShowDrugOrderForm(!showDrugOrderForm);
  }
  return (
    <Row>

      <Col lg={6}>
        <Card>
          <CardHeader>
            <Button.Group >
              <Button toggle active={showDrugOrderForm} onClick={handleToggle}>Drug</Button>
              <Button.Or />
              <Button toggle active={!showDrugOrderForm} onClick={handleToggle}>Regimen</Button>
            </Button.Group>
          </CardHeader>
          <CardBody>

            {/*toggle drug and regimen form */}
            {showDrugOrderForm && <DrugOrder patientId={props.patientId} visitId={props.visitId}/>}
            {!showDrugOrderForm && <RegimenOrder patientId={props.patientId} visitId={props.visitId}/>}

          </CardBody>
        </Card>
      </Col>

      <Col lg={6}>
               <Row>
          <Col lg={12}>
            <Card style={cardStyle}>
              <CardHeader>Previous Drug Order</CardHeader>
              <PreviousMedication patientId={props.patient.patientId} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    drugList: state.medication.medicationList,
    previousMedicationList: state.patients.previousMedications,
  };
};

const mapActionToProps = {
  create: encounterAction.create,

};

export default connect(mapStateToProps, mapActionToProps)(MedicationPage);
