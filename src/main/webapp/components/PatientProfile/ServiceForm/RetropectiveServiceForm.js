import React, { useState } from "react";
import {
  Alert,
  CardBody,
  Card,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import * as actions from "actions/formManager";
import * as patientActions from "actions/patients";
import * as encounterAction from "actions/encounter";
import FormRenderer from "components/FormManager/FormRenderer";
import ViewForm from "components/FormManager/FormRendererView";
import UpdateForm from "components/FormManager/FormRendererUpdate";
import ViewAllForms from "components/FormManager/FormRendererViewList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as CODES from "api/codes";
import Select from "react-select";
import axios from 'axios';
import { url } from "../../../api";
import {authentication} from '../../../_services/authentication';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import {DatePicker} from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
// import Moment from "moment";
import "./ServiceForm.css";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";

const cardStyle = {
  borderColor: "#fff",
  marginBottom: 10,
  height: 600,
  overflow: "auto",
};

function ServiceFormPage(props) {
  const [showLoading, setShowLoading] = useState(false);
  const [showServiceFormLoading, setShowServiceFormLoading] = useState(false);
  const [showEncounterLoading, setShowEncounterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [encounterMessage, setEncounterMessage] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showFormPage, setShowFormPage] = useState(false);
  const [currentForm, setCurrentForm] = useState();
  const [patientEncounters, setPatientEncouters] = useState([]);
  const [dateEncounter, setDateEncounter] = useState(null);

  const togglePage = () => {
    if (showFormPage) {
      //clear the current form value.
      setCurrentForm(null);
    }
    return setShowFormPage(!showFormPage);
  };

  React.useEffect(() => {
    fetchEncounters();
  }, []);

  React.useEffect(() => {
    setShowLoading(true);
    const onSuccess = () => {
      setShowLoading(false);
    };
    const onError = () => {
      setMessage("Could not fetch available services. Please try again later");
      setShowLoading(false);
      setPrograms([]);
    };
    props.fetchPrograms(onSuccess, onError);
  }, []);


  React.useEffect(() => {
    setPrograms(
      props.programList
        .map((x) => ({ ...x, label: x.name, value: x.code }))
        //.filter((x) => x.value === CODES.GENERAL_SERVICE)
    );
  }, [props.programList]);

  const fetchEncounters = () => {
    setShowEncounterLoading(true);
    const onSuccess = () => {
      setPatientEncouters(props.patientEncounterList)
      setShowEncounterLoading(false);
    };
    const onError = () => {
      setMessage(
        "Could not fetch service forms history. Please try again later"
      );
      setShowEncounterLoading(false);
      setPatientEncouters([]);
    };
    props.fetchPatientEncounters(props.patient.patientId, onSuccess, onError);
  };


  React.useEffect(() => {
    try {
      setPatientEncouters(props.patientEncounterList);
    } catch (err) {
      console.log(err);
    }
    console.log(patientEncounters);
  }, [props.patientEncounterList]);

  const loadForm = () => {
    if(!dateEncounter){
      toast.error('Enter encounter date');
      return;
    }
    if (!currentForm) {
      return;
    }
    togglePage();
  };

  const viewForm = (value) => {
    props.fetchEncounterInfo(value.encounterId);
    setCurrentForm({ ...value, type: "VIEW" });
    togglePage();
  };

  const viewAllForm = (value) => {
    setCurrentForm({ ...value, type: "VIEW_ALL" });
    togglePage();
  };
  const editForm = (value) => {
    props.fetchEncounterInfo(value.encounterId);
    setCurrentForm({ ...value, type: "EDIT" });
    togglePage();
  };

  const onSuccess = () => {
    toast.success("Form saved successfully!", { appearance: "success" });
    fetchEncounters();
    togglePage();
  };

  const handleProgramChange = (newValue, actionMeta) => {
    fetchServiceByProgram(newValue.id);
  };

  async function fetchServiceByProgram( programId) {
    setShowServiceFormLoading(true);
    await axios.get( url+ `programs/${programId}/forms`)
        .then(response => {
          setShowServiceFormLoading(false);
         // let list = response.data.filter((x) => (x.programCode === CODES.GENERAL_SERVICE && x.name.includes('Retrospective')) || x.programCode !== CODES.GENERAL_SERVICE);
         // let otherList = response.data.filter((x) => x.name.includes('Retrospective'))
          setServiceList(response.data.filter((x) => (x.programCode === CODES.GENERAL_SERVICE && x.name.includes('Retrospective')) || x.programCode !== CODES.GENERAL_SERVICE));
        })
        .catch(error => {
              setShowServiceFormLoading(false);
              setServiceList([]);
            }
        );
  }
  async function fetchPatientServiceByProgram(patientId, programCode) {
      setShowServiceFormLoading(true);
      await axios.get( url+ `patients/${patientId}/${programCode}/form`)
          .then(response => {
        setShowServiceFormLoading(false);
        setServiceList(response.data);
      })
          .catch(error => {
            setShowServiceFormLoading(false);
            setServiceList([]);
              }
          );
  }

  const handleChange = (newValue, actionMeta) => {
    setCurrentForm({ ...newValue, type: "NEW" });
  };

  return (
    <div>
      {!showFormPage ? (
        <Row>
          <Col lg={5}>
            <Card style={cardStyle} className=" p-3">
              <CardHeader>Available Retrospective Service Forms</CardHeader>
              <CardBody>
                {message ? <Alert color="primary">{message}</Alert> : ""}

                <div>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="encounterDate">Encounter Date*</Label>
                      <DatePicker
                          name="encounterDate"
                          id="encounterDate"
                         // defaultValue={new Date()}
                          max={new Date()}
                          required
                          onChange={(e) => {setDateEncounter(e)}
                              // setTestOrder({
                              //   ...testOrder,
                              //   ...{
                              //     sample_order_date: e ? Moment(e).format(
                              //         "DD-MM-YYYY"
                              //     ) : null,
                              //     sample_order_time: e ? Moment(e).format("LT") : null,
                              //   },
                              // })
                          }

                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    {" "}
                    <FormGroup>
                      <Label for="services">Select A Service </Label>
                      <Select
                        required
                        isMulti={false}
                        onChange={handleProgramChange}
                        options={programs}
                        isLoading={showLoading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    {" "}
                    <FormGroup>
                      <Label for="services">Select Service Form </Label>
                      <Select
                        required
                        isMulti={false}
                        onChange={handleChange}
                        isLoading={showServiceFormLoading}
                        options={serviceList.map((x) => ({
                          ...x,
                          label: x.name,
                          value: x.id,
                        }))}
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col md={12}>

                        <Button
                          color="primary"
                          className=" mr-1"
                          onClick={loadForm}
                          disabled={!authentication.userHasRole(["patient_write"])}
                        >
                          Open Form
                        </Button>

                  </Col>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={7}>
            <Card style={cardStyle} className=" p-3">
              <CardHeader>Retrospective Service Forms History</CardHeader>
              <CardBody>
                {encounterMessage ? (
                  <Alert color="primary">{encounterMessage}</Alert>
                ) : (
                  ""
                )}
                <MaterialTable
                    components={{
                      Container: props => <Paper {...props} elevation={0}/>
                    }}
                    isLoading={showEncounterLoading}
                    title="Services Form History"
                    columns={[
                      { title: 'Form Name', field: 'formName' },
                      { title: 'Date', field: 'date' },
                    ]}
                    data={props.patientEncounterList}
                    actions={[
                      rowData => ({
                        icon: VisibilityIcon,
                        tooltip: 'View Form',
                        onClick: (event, rowData) => viewForm(rowData),
                        disabled: !authentication.userHasRole(["patient_write"]),
                      }),
                      {
                        icon: EditIcon,
                        tooltip: 'Edit Form',
                        onClick: (event, rowData) => editForm(rowData)
                      },
                    ]}
                    options={{
                      actionsColumnIndex: -1,
                      searchFieldStyle: {
                        width : '250%',
                        marginTop: '-25px',
                      },
                      searchFieldAlignment: "left",
                      padding: 'dense',
                      header: false,
                      showTitle: false
                    }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <React.Fragment>
          <Row>
            <Col>
              <Button
                color="primary"
                className=" float-right mr-1"
                onClick={togglePage}
              >
                Go Back
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {currentForm && currentForm.type === "NEW" && (
                <FormRenderer
                  patientId={props.patient.patientId}
                  formCode={currentForm.code}
                  programCode={currentForm.programCode}
                  visitId={props.patient.visitId}
                  onSuccess={onSuccess}
                  dateEncounter={dateEncounter}
                  formType={1}
                />
              )}
              {currentForm && currentForm.type === "VIEW" && (
                <ViewForm
                  patientId={props.patient.patientId}
                  formCode={currentForm.formCode}
                  programCode={currentForm.programCode}
                  visitId={props.patient.visitId}
                  onSuccess={onSuccess}
                  encounterId={currentForm.encounterId}
                />
              )}
              {currentForm && currentForm.type === "EDIT" && (
                <UpdateForm
                  patientId={props.patient.patientId}
                  formCode={currentForm.formCode}
                  programCode={currentForm.programCode}
                  visitId={props.patient.visitId}
                  onSuccess={onSuccess}
                  encounterId={currentForm.encounterId}
                  formType={1}
                />
              )}
              {currentForm && currentForm.type === "VIEW_ALL" && (
                <ViewAllForms
                  patientId={props.patient.patientId}
                  formCode={currentForm.formCode}
                  programCode={currentForm.programCode}
                  visitId={props.patient.visitId}
                  onSuccess={onSuccess}
                />
              )}
            </Col>
          </Row>
        </React.Fragment>
      )}
      <ToastContainer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    formList: state.formManager.formList,
    programList: state.formManager.programList,
    patientEncounterList: state.patients.exclusiveEncounters,
    encounter: state.encounter.encounter,
    serviceList: state.formReducers.form,
  };
};

const mapActionToProps = {
  fetchForms: actions.fetchAll,
  fetchPrograms: actions.fetchAllPrograms,
  fetchPatientEncounters:
    patientActions.fetchPatientEncounterProgramCodeExclusionList,
  fetchEncounterInfo: encounterAction.fetchById,
};

export default connect(mapStateToProps, mapActionToProps)(ServiceFormPage);
