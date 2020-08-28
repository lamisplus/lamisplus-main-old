import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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
import DataTable from "react-data-table-component";
import Spinner from "react-bootstrap/Spinner";
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
  const [serviceForms, setServiceForms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
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
    setShowServiceFormLoading(true);
    const onSuccess = () => {
      setShowServiceFormLoading(false);
    };
    const onError = () => {
      setMessage(
        "Could not fetch available service forms. Please try again later"
      );
      setShowServiceFormLoading(false);
      setServiceForms([]);
    };
    props.fetchForms(onSuccess, onError);
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
    const filteredForms = props.formList.filter(
      (x) => x.programCode !== CODES.GENERAL_SERVICE
    );
    setServiceForms(filteredForms);
  }, [props.formList]);

  React.useEffect(() => {
    setPrograms(
      props.programList
        .map(({ name, code }) => ({ label: name, value: code }))
        .filter((x) => x.value !== CODES.GENERAL_SERVICE)
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
          <IconButton
            color="primary"
            size="small"
            aria-label="View All Forms"
            title="View All Form"
            onClick={() => viewAllForm(row)}
            className="fa fa-list"
          ></IconButton>
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

  const esubHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (efilterText) {
        setEResetPaginationToggle(!eresetPaginationToggle);
        setEFilterText("");
      }
    };
    return (
      <EncounterFilterComponent
        onFilter={(e) => setEFilterText(e.target.value)}
        onClear={handleClear}
        efilterText={efilterText}
      />
    );
  }, [efilterText, eresetPaginationToggle]);

  const handleProgramChange = (newValue, actionMeta) => {
    setFilteredForms(
      serviceForms.filter((x) => x.programCode === newValue.value)
    );
  };
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
                        options={filteredForms.map((x) => ({
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
                {showEncounterLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span> Fetching Service Form History &nbsp; </span>{" "}
                    <Spinner animation="border" role="status">
                      <span className="sr-only"></span>
                    </Spinner>
                  </div>
                ) : (
                  ""
                )}
                {(patientEncounters && patientEncounters.length) > 0 ? (
                  <div>
                    <DataTable
                      columns={encounterColumns(
                        viewForm,
                        editForm,
                        viewAllForm
                      )}
                      data={encounterFilteredItems}
                      pagination
                      paginationResetDefaultPage={eresetPaginationToggle}
                      subHeader
                      subHeaderComponent={esubHeaderComponentMemo}
                      highlightOnHover={true}
                      subHeaderAlign={"left"}
                      noTableHead={true}
                      noHeader={true}
                    />
                  </div>
                ) : (
                  ""
                )}
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
