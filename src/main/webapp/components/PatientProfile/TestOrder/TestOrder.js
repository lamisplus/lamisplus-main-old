import React, { useState } from "react";
import MatButton from "@material-ui/core/Button";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import SaveIcon from "@material-ui/icons/Save";

import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import * as encounterActions from "actions/encounter";
import * as actions from "actions/laboratory";
import { fetchPatientTestOrders , fetchPatientRadiologyTestOrder} from "actions/patients";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import * as CODES from "api/codes";
import PreviousTestOrder from "./TestOrderHistory";
import PreviousRadiologyTestOrder from "./RadiologyTestOrderHistory";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { BehaviorSubject } from "rxjs";
import { ToastContainer, toast } from "react-toastify";
import { Button } from 'semantic-ui-react'

import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import LabTestOrderPage from "./LabTestOrderPage";
import RadiologyTestOrderPage from "./RadiologyTestOrderPage";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();
function TestOrderPage(props) {
  const PatientID = props.patientId;
  const visitId = props.visitId;
  const [testOrders, setTestOrders] = React.useState([]);
  const [radiologyTestOrders, setRadiologyTestOrders] = React.useState([]);
  const [showLabForm, setShowLabForm] = React.useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const removeLabTest = (index) => {
    const testOrderList = [...testOrders];
    testOrderList.splice(index, 1);
    setTestOrders(testOrderList);
  };

  const removeRadiologyTest = (index) => {
    const testOrderList = [...radiologyTestOrders];
    testOrderList.splice(index, 1);
    setRadiologyTestOrders(testOrderList);
  };

  const addNewLabTest = (testOrder) => {
    setTestOrders([...testOrders, testOrder]);
  };

  const addRadiologyTest = (testOrder) => {
    setRadiologyTestOrders([...radiologyTestOrders, testOrder]);
  };

  const saveLabTestOrder = (e) => {
    e.preventDefault();
    if (showLoading) {
      return;
    }

    if (!testOrders || testOrders.length < 1) {
      toast.error("You must pick a test before you can submit");
      return;
    }

    // default values in the create lab test order API payload
    const defaults = {
      patient_id: props.patientId,
      test_result: "",
      date_result_reported: "",
      date_sample_collected: "",
      comment: "",
      user_id: "",
      sample_type: "",
      lab_test_order_status: 0
    };

    //looping through the test order to create the formData structure expected by the server
    var orders = testOrders.map((x) => {
      return {
        ...{
          lab_test_id: x.test.value.id,
          description: x.test.value.name,
          lab_test_group: x.testGroup.value.name,
          lab_test_group_id: x.testGroup.value.id,
          unit_measurement: x.test.value.unitMeasurement,
          order_priority: x.priority.value,
          viral_load_indication: x.vlIndication.value,
          sample_ordered_by: x.sampleOrderedBy,
          sample_order_date: x.sample_order_date,
          sample_order_time: x.sample_order_time,
        },
        ...defaults,
      };
    });

    const data = {
      data: orders,
      patientId: PatientID,
      visitId: visitId,
      formCode: CODES.LAB_TEST_ORDER_FORM,
      programCode: CODES.GENERAL_SERVICE,
      dateEncounter: moment(new Date()).format("DD-MM-YYYY"),
    };

    setShowLoading(true);

    const onSuccess = () => {
      setShowLoading(false);
      setTestOrders([]);
      toast.success("Test Order Successfully Saved!");
      props.fetchPatientTestOrder(props.patientId);
    };
    const onError = () => {
      toast.error("An error occurred, could not save request!");
      setShowLoading(false);
    };
    props.createLabOrder(data, onSuccess, onError);
  };

  const saveRadiologyTestOrder = (e) => {
    e.preventDefault();
    if (showLoading) {
      return;
    }

    if (!radiologyTestOrders || radiologyTestOrders.length < 1) {
      toast.error("You must pick a test before you can submit");
      return;
    }

    // default values in the create lab test order API payload
    const defaults = {
      patient_id: props.patientId,
      files: [],
      note: "",
      result_date: null,
      result_time: null,
      user_id: "",
      test_order_status: 0
    };

    //looping through the test order to create the formData structure expected by the server
    var orders = radiologyTestOrders.map((x) => {
      return {
        ...{
          test_id: x.test.value.id,
          description: x.test.value.name,
          test_group: x.testGroup.value.name,
          test_group_id: x.testGroup.value.id,
          order_priority: x.priority.value,
          ordered_by: x.sampleOrderedBy,
          order_date: x.sample_order_date,
          order_time: x.sample_order_time,
        },
        ...defaults,
      };
    });

    const data = {
      data: orders,
      patientId: PatientID,
      visitId: visitId,
      formCode: CODES.RADIOLOGY_TEST_ORDER,
      programCode: CODES.GENERAL_SERVICE,
      dateEncounter: moment(new Date()).format("DD-MM-YYYY"),
    };

    setShowLoading(true);

    const onSuccess = () => {
      setShowLoading(false);
      setRadiologyTestOrders([]);
      toast.success("Test Order Successfully Saved!");
      props.fetchPatientRadiologyTestOrder(props.patientId);
    };
    const onError = () => {
      toast.error("An error occurred, could not save request!");
      setShowLoading(false);
    };
    props.createLabOrder(data, onSuccess, onError);
  };


  //to handle the toggle between the lab and radiology forms
  const handleToggle = () => {
    setShowLabForm(!showLabForm);
  }

  return (
    <Row>
      <ToastContainer />
      <Col md={4}>
        <Card>
          <CardHeader>
            <Button.Group >
              <Button toggle active={showLabForm} onClick={handleToggle}>Laboratory</Button>
              <Button.Or />
              <Button toggle active={!showLabForm} onClick={handleToggle}>Radiology</Button>
            </Button.Group>
         </CardHeader>
          <CardBody>

            {/*toggle lab and radiology form */}
            {showLabForm && <LabTestOrderPage addNewTest={addNewLabTest}/>}
            {!showLabForm && <RadiologyTestOrderPage addNewTest={addRadiologyTest}/>}

              </CardBody>
        </Card>
      </Col>
      <Col md={8}>
        {showLabForm && testOrders.length > 0 && (
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader>Current Test Order</CardHeader>
                <Row>
                  <Col md={12}>
                    <List>
                      {testOrders.map((testOrder, index) => (
                        <TestOrderList
                          key={index}
                          index={index}
                          testOrder={testOrder}
                          removeTest={removeLabTest}
                        />
                      ))}
                    </List>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={12}>
              <br></br>
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveLabTestOrder}
              >
                Save &nbsp;
                {showLoading ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  ""
                )}
              </MatButton>

              <br></br>
              <hr></hr>
            </Col>
          </Row>
        )}

        {!showLabForm && radiologyTestOrders.length > 0 && (
            <Row>
              <Col md={12}>
                <Card>
                  <CardHeader>Current Test Order</CardHeader>
                  <Row>
                    <Col md={12}>
                      <List>
                        {radiologyTestOrders.map((testOrder, index) => (
                            <RadiologyTestOrderList
                                key={index}
                                index={index}
                                testOrder={testOrder}
                                removeTest={removeRadiologyTest}
                            />
                        ))}
                      </List>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col md={12}>
                <br></br>
                <MatButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={saveRadiologyTestOrder}
                >
                  Save &nbsp;
                  {showLoading ? (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                  ) : (
                      ""
                  )}
                </MatButton>

                <br></br>
                <hr></hr>
              </Col>
            </Row>
        )}

        <Row>
          { showLabForm &&
          <Col md={12}>
            <Card>
              <CardHeader>Previous Lab Test Order</CardHeader>
              <PreviousTestOrder patientId={props.patient.patientId} />
            </Card>
          </Col> }
          { !showLabForm &&
          <Col md={12}>
            <Card>
              <CardHeader>Previous Radiology Order</CardHeader>
              <PreviousRadiologyTestOrder patientId={props.patient.patientId} />
            </Card>
          </Col> }
        </Row>
      </Col>
    </Row>
  );
}

//Laboratory Lab Test Order List
function TestOrderList({ testOrder, index, removeTest }) {
  return (
    <ListItem>
      <ListItemText
        primary={
          <strong>
            {testOrder.testGroup ? testOrder.testGroup.value.name : ""} -{" "}
            {testOrder.test ? testOrder.test.value.name : ""}
          </strong>
        }
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              Priority:{" "}
              <b>
                {" "}
                {testOrder.priority
                  ? testOrder.priority.value.display
                  : ""}{" "}
              </b>
              {testOrder.vlIndication ? (
                <span>
                  {" "}
                  | VL Indication:{" "}
                  <b>{testOrder.vlIndication.value.display} </b>
                </span>
              ) : (
                ""
              )}
            
              <br></br> Sample Ordered by: <b> {testOrder.sampleOrderedBy}</b> | Date Ordered: <b>{moment(testOrder.sample_order_date, "DD-MM-YYYY").format("MMM DD, YYYY")} {testOrder.sample_order_time}</b>
              
            </Typography>
          </React.Fragment>
        }
      />

      <ListItemSecondaryAction onClick={() => removeTest(index)}>
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

//Laboratory Radiology Test Order List
function RadiologyTestOrderList({ testOrder, index, removeTest }) {
  return (
      <ListItem>
        <ListItemText
            primary={
              <strong>
                {testOrder.testGroup ? testOrder.testGroup.value.name : ""} -{" "}
                {testOrder.test ? testOrder.test.value.name : ""}
              </strong>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" variant="body2" color="textPrimary">
                  Priority:{" "}
                  <b>
                    {" "}
                    {testOrder.priority
                        ? testOrder.priority.value.display
                        : ""}{" "}
                  </b>

                  <br></br> Sample Ordered by: <b> {testOrder.sampleOrderedBy}</b> | Date Ordered: <b>{moment(testOrder.sample_order_date, "DD-MM-YYYY").format("MMM DD, YYYY")} {testOrder.sample_order_time}</b>

                </Typography>
              </React.Fragment>
            }
        />

        <ListItemSecondaryAction onClick={() => removeTest(index)}>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
  );
}
const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    testGroupList: state.laboratory.testGroup,
    tests: state.laboratory.tests,
    priorities: state.applicationCodesets.priorities,
    vlIndications: state.applicationCodesets.vlIndications,
  };
};

const mapActionToProps = {
  fetchTestGroup: actions.fetchAllTestGroup,
  fetchTestByTestGroup: actions.fetchAllTestsByTestGroup,
  createLabOrder: encounterActions.create,
  fetchApplicationCodeSet: fetchApplicationCodeSet,
  fetchPatientTestOrder: fetchPatientTestOrders,
  fetchPatientRadiologyTestOrder: fetchPatientRadiologyTestOrder
};

export default connect(mapStateToProps, mapActionToProps)(TestOrderPage);
