import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import {
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Alert,
  Card,
  CardBody,
  CardHeader,
  CardDeck,
} from "reactstrap";
import SaveIcon from "@material-ui/icons/Save";

import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import Select from "react-select";
import * as encounterActions from "actions/encounter";
import * as actions from "actions/laboratory";
import { fetchPatientTestOrders } from "actions/patients";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { v1 as uuidv1 } from "uuid";
import * as CODES from "api/codes";
import PreviousTestOrder from "./TestOrderHistory";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  APPLICATION_CODESET_PRIORITIES,
  APPLICATION_CODESET_VL_INDICATION,
} from "actions/types";
import CheckedInValidation from "components/Utils/CheckedInValidation";
import { BehaviorSubject } from "rxjs";
import { ToastContainer, toast } from "react-toastify";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";

import Moment from "moment";
import momentLocalizer from "react-widgets-moment";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();
function TestOrderPage(props) {
  const PatientID = props.patientId;
  const visitId = props.visitId;
  const [tests, setTests] = React.useState([]);
  const [testOrders, setTestOrders] = React.useState([]);
  const defaultFormValue = {
    test: {},
    priority: {},
    testGroup: {},
    vlIndication: "",
    sampleOrderedBy: "",
    sample_order_date: moment(new Date()).format("DD-MM-YYYY"),
    sample_order_time: moment(new Date()).format("LT")
  };
  const [testOrder, setTestOrder] = React.useState(defaultFormValue);
  const [showLoading, setShowLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  React.useEffect(() => {
    if (props.priorities.length === 0) {
      props.fetchApplicationCodeSet("PRIORITY", APPLICATION_CODESET_PRIORITIES);
    }
    if (props.vlIndications.length === 0) {
      props.fetchApplicationCodeSet(
        "VL_INDICATION",
        APPLICATION_CODESET_VL_INDICATION
      );
    }
    if (props.testGroupList.length === 0) {
      setErrorMessage();
      const onSuccess = () => {};
      const onError = (errstatus) => {
        setErrorMessage(
          "Could not fetch test groups at the moment, try again later"
        );
      };
      props.fetchTestGroup(onSuccess, onError);
    }
  }, []);

  React.useEffect(() => {
    setTests(props.tests);
  }, [props.tests]);

  const onInputChange = (e) => {
    e.persist();
    setTestOrder({ ...testOrder, [e.target.name]: e.target.value });
  };

  const getTestByTestGroup = (testGroup) => {
    setTestOrder({ ...testOrder, testGroup: testGroup });
    async function fetchTests() {
      setErrorMessage("");
      const onSuccess = () => {
        setTests(props.tests);
      };
      const onError = (errstatus) => {
        setErrorMessage("Could not fetch test list, please try again later");
        setTests([]);
      };
      props.fetchTestByTestGroup(testGroup.value.id, onSuccess, onError);
    }
    fetchTests();
  };
  function getTestGroupNameById(id) {
    //  return testGroups.find((x) => x.value === id).label;
  }

  const removeTest = (index) => {
    const testOrderList = [...testOrders];
    testOrderList.splice(index, 1);
    setTestOrders(testOrderList);
  };

  const isViralLoad = () => {
    let value =
      testOrder &&
      testOrder.test &&
      testOrder.test.value &&
      testOrder.test.value.name === "Viral Load";
    return value;
  };

  const addNewTest = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!testOrder) return;
    //
    if (
      !(
        testOrder.sample_order_date &&
        testOrder.sample_order_time &&
        testOrder.test.value &&
        testOrder.priority.value &&
        testOrder.sampleOrderedBy
      )
    ) {
      window.scrollTo(0, 0);
      setErrorMessage("Fill all required fields");
      return;
    }

    if (isViralLoad() && !testOrder.vlIndication.value) {
      window.scrollTo(0, 0);
      setErrorMessage("Fill all required fields");
      return;
    }
    setTestOrders([...testOrders, testOrder]);
    setTestOrder(defaultFormValue);
  };

  const saveTestOrder = (e) => {
    e.preventDefault();
    if (showLoading) {
      return;
    }

    if (!testOrders || testOrders.length < 1) {
      setErrorMessage("You must pick a test before you can submit");
      return;
    }

    // default value that have to go with the form data
    const defaults = {
      patient_id: props.patientId,
      test_result: "",
      date_result_reported: "",
      date_sample_collected: "",
      comment: "",
      user_id: "",
      sample_type: "",
      //lab_test_order_id: uuidv1(),
      lab_test_order_status: 0,
      //sample_order_date: moment(new Date()).format("DD-MM-YYYY"),
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
    setSuccessMessage("");
    const onSuccess = () => {
      setShowLoading(false);
      setTestOrders([]);
      setSuccessMessage("Test Order Successfully Saved!");
      toast.success("Test Order Successfully Saved!");
      props.fetchPatientTestOrder(props.patientId);
    };
    const onError = () => {
      toast.error("An error occurred, could not save request!");
      setErrorMessage("An error occurred, could not save request!");
      setShowLoading(false);
    };
    props.createLabOrder(data, onSuccess, onError);
  };

  return (
    <Row>
      <ToastContainer />
      <Col md={4}>
        <Card>
          <CardHeader> Test Order</CardHeader>
          <CardBody>
            {successMessage ? (
              <Alert color="success">{successMessage}</Alert>
            ) : (
              ""
            )}
            {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : ""}
            <br />
            <form onSubmit={addNewTest}>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="encounterDate">Encounter Date & Time*</Label>
                    <DateTimePicker
                      name="encounterDate"
                      id="encounterDate"
                      defaultValue={new Date()}
                      max={new Date()}
                      required
                      onChange={(e) =>
                        setTestOrder({
                          ...testOrder,
                          ...{
                            sample_order_date: e ? Moment(e).format(
                              "DD-MM-YYYY" 
                            ) : null,
                            sample_order_time: e ? Moment(e).format("LT") : null,
                          },
                        })
                      }
                      // onChange={(value1) =>
                      //   setOtherFields({
                      //     ...otherfields,
                      //     time_sample_transfered: moment(value1).format("LT"),
                      //   })
                      // }
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="testGroup">Select Test Order*</Label>
                    <Select
                      required
                      isMulti={false}
                      value={testOrder.testGroup}
                      onChange={getTestByTestGroup}
                      options={props.testGroupList.map((x) => ({
                        label: x.name,
                        value: x,
                      }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="testGroup">Select Test*</Label>

                    <Select
                      isMulti={false}
                      required
                      value={testOrder.test}
                      onChange={(e) => setTestOrder({ ...testOrder, test: e })}
                      options={tests.map((x) => ({
                        label: x.name,
                        value: x,
                      }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="priority">Select Priority*</Label>
                    <Select
                      isMulti={false}
                      required
                      value={testOrder.priority}
                      onChange={(e) =>
                        setTestOrder({ ...testOrder, priority: e })
                      }
                      options={props.priorities.map((x) => ({
                        label: x.display,
                        value: x,
                      }))}
                    />
                  </FormGroup>
                </Col>
                {isViralLoad() && (
                  <Col md={12}>
                    <FormGroup>
                      <Label for="vlIndication">VL Indication*</Label>
                      <Select
                        isMulti={false}
                        required
                        value={testOrder.vlIndication}
                        onChange={(e) =>
                          setTestOrder({ ...testOrder, vlIndication: e })
                        }
                        options={props.vlIndications.map((x) => ({
                          label: x.display,
                          value: x,
                        }))}
                      />
                    </FormGroup>
                    {/* <FormGroup>
                      <Label for="vlIndication">VL Indication*</Label>
                      <Input
                        required
                        name="vlIndication"
                        id="vlIndication"
                        value={testOrder.vlIndication}
                        onChange={onInputChange}
                      />
                    </FormGroup> */}
                  </Col>
                )}
                <Col md={12}>
                  <FormGroup>
                    <Label for="sampleOrderedBy">Sample Ordered By*</Label>
                    <Input
                      required
                      name="sampleOrderedBy"
                      id="sampleOrderedBy"
                      value={testOrder.sampleOrderedBy}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={12}>
                  <CheckedInValidation
                    actionButton={
                      <Button
                        className="btn btn-primary "
                        type="button"
                        onClick={addNewTest}
                      >
                        Add Test
                      </Button>
                    }
                    visitId={props.patient.visitId}
                  />
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Col>
      <Col md={8}>
        {testOrders.length > 0 && (
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
                          removeTest={removeTest}
                        />
                      ))}
                    </List>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={12}>
              <br></br>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveTestOrder}
              >
                Save &nbsp;
                {showLoading ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  ""
                )}
              </Button>

              <br></br>
              <hr></hr>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>Previous Test Order</CardHeader>
              <PreviousTestOrder patientId={props.patient.patientId} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

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
};

export default connect(mapStateToProps, mapActionToProps)(TestOrderPage);
