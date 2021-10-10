import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import {
  Form,
  Input,
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
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Select from "react-select";
import CheckedInValidation from "components/Utils/CheckedInValidation";
import axios from 'axios';
import { url } from "../../../api";
import {authentication} from '../../../_services/authentication';
import "./ServiceForm.css";
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';

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
  const [efilterText, setEFilterText] = React.useState("");
  const [eresetPaginationToggle, setEResetPaginationToggle] = React.useState(
    false
  );
  const [showFormPage, setShowFormPage] = useState(false);
  const [currentForm, setCurrentForm] = useState();
  const [patientEncounters, setPatientEncouters] = useState([]);

  const encounterFilteredItems = !patientEncounters
    ? []
    : patientEncounters.filter(
        (item) =>
          item.formName &&
          item.formName.toLowerCase().includes(efilterText.toLowerCase())
      );


  const togglePage = () => {
    if (showFormPage) {
      //clear the current form value.
      setCurrentForm(null);
    }
    return setShowFormPage(!showFormPage);
  };


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
        .filter((x) => ( x.value !== CODES.GENERAL_SERVICE && x.value !== CODES.RETROSPECTIVE_SERVICE ))
    );
  }, [props.programList]);

  const fetchEncounters = () => {
    setShowEncounterLoading(true);
    const onSuccess = () => {
      //setPatientEncouters(props.patientEncounterList)
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
    fetchEncounters();
  }, []);

  React.useEffect(() => {
    try {
      setPatientEncouters(props.patientEncounterList);
    } catch (err) {
      console.log(err);
    }
    console.log(patientEncounters);
  }, [props.patientEncounterList]);

  const loadForm = () => {
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

  const EncounterFilterComponent = ({ efilterText, onFilter, onClear }) => (
    <Form className="cr-search-form" onSubmit={(e) => e.preventDefault()}>
      <Card>
        <CardBody>
          <Input
            type="search"
            placeholder="Search by Form Name "
            className="cr-search-form__input pull-right"
            value={efilterText}
            onChange={onFilter}
          />
        </CardBody>
      </Card>
    </Form>
  );
  const encounterColumnsNoAction = (viewForm, editForm, viewAllForm) => [
    {
      name: "Service Form",
      selector: "formName",
      sortable: false,
      cell: (row) => (
          <p>
            {row.formName} -{" "}
            <small>
              {row.dateEncounter || ""} {row.timeCreated || ""}
            </small>
          </p>
      ),
    }
      ];
  const encounterColumns = (viewForm, editForm, viewAllForm) => [
    {
      name: "Service Form",
      selector: "formName",
      sortable: false,
      cell: (row) => (
        <p>
          {row.formName} -{" "}
          <small>
            {row.dateEncounter || ""} {row.timeCreated || ""}
          </small>
        </p>
      ),
    },
    {
      cell: (row) => (
        <React.Fragment>
          {/*<IconButton*/}
          {/*  color="primary"*/}
          {/*  size="small"*/}
          {/*  aria-label="View All Forms"*/}
          {/*  title="View All Form"*/}
          {/*  onClick={() => viewAllForm(row)}*/}
          {/*  className="fa fa-list"*/}
          {/*></IconButton>*/}
          <IconButton
            color="primary"
            size="small"
            aria-label="View Form"
            title="View Form"
            onClick={() => viewForm(row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            aria-label="Edit Form"
            title="Edit Form"
            onClick={() => editForm(row)}
            disabled={!authentication.userHasRole(["patient_write"])}
          >
            <EditIcon />
          </IconButton>
        </React.Fragment>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const handleProgramChange = (newValue, actionMeta) => {
    fetchPatientServiceByProgram(props.patient.patientId, newValue.code);
  };

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
              <CardHeader>Available Service Forms</CardHeader>
              <CardBody>
                {message ? <Alert color="primary">{message}</Alert> : ""}

                <div>
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
                    <CheckedInValidation
                      actionButton={
                        <Button
                          color="primary"
                          className=" mr-1"
                          onClick={loadForm}
                          disabled={!authentication.userHasRole(["patient_write"])}
                        >
                          Open Form
                        </Button>
                      }
                      visitId={props.patient.visitId}
                    />
                  </Col>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={7}>

            <Card style={cardStyle} className=" p-3">
              <CardHeader>Service Forms History</CardHeader>
              <CardBody>

                {encounterMessage ? (
                  <Alert color="primary">{encounterMessage}</Alert>
                ) : (
                  ""
                )}
                    <MaterialTable
                    icons={tableIcons}
                        components={{
                          Container: props => <Paper {...props} elevation={0}/>
                        }}
                        isLoading={showEncounterLoading}
                        title="Services Form History"
                        columns={[
                          { title: 'Form Name', field: 'formName' },
                          { title: 'Date', field: 'date' },
                        ]}
                        data={patientEncounters}
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
                          showTitle: false,
                          pageSize: 15
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
                  options={true}
                  hideHeader={true}
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
