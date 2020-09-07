import React, { useState } from "react";
import {
  FormGroup,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardDeck,
  Alert,
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Spinner from "react-bootstrap/Spinner";
import PatientVitals from "components/PatientProfile/PatientDashboardWidgets/PatientVitals";
import PatientAllergies from "components/PatientProfile/PatientDashboardWidgets/PatientAllergies";
import moment from "moment";
import { connect } from "react-redux";
import * as actions from "actions/consultation";
import * as CODES from "api/codes";
import FormRenderer from "components/FormManager/FormRenderer";
import "./consultation.css"
import { ToastContainer, toast } from "react-toastify";

function ConsultationPage(props) {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const onDismiss = () => setShowErrorMsg(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const onDismissSuccess = () => setShowSuccessMsg(false);
  const initialConsultState = {
    present_consultation: "",
    consultation_notes: "",
    formCode: CODES.CONSULTATION_FORM,
    programCode: CODES.GENERAL_SERVICE,
  };
  const [consult, setconsult] = useState(initialConsultState);
  const [newAllergy, setNewAllergy] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [currentForm, setCurrentForm] = useState({
    code: CODES.CONSULTATION_FORM,
    programCode: CODES.GENERAL_SERVICE,
    formName: "PATIENT CONSULTATION",
    options:{
      hideHeader: true
    },
  });
  const onSuccess = () => {
    setShowSuccessMsg(true);
    setSuccessMsg("Consultation saved successfully!");
    window.scrollTo(0, 0);
  };
  const Saveconsult = (e) => {
    e.preventDefault();
    if (showLoading) {
      return;
    }

    const formData = [
      {
        allergies: newAllergy,
        presentConsultation: consult.present_consultation,
        consultationNotes: consult.consultation_notes,
      },
    ];
    const data = {
      data: formData,
      patientId: props.patientId,
      visitId: props.visitId,
      formCode: CODES.CONSULTATION_FORM,
      programCode: CODES.GENERAL_SERVICE,
      dateEncounter: moment(new Date()).format("DD-MM-YYYY"),
    };
    setShowSuccessMsg(false);
    setShowErrorMsg(false);
    setShowLoading(true);
    const onSuccess = () => {
      setconsult(initialConsultState);
      setNewAllergy([]);
      setShowLoading(false);
      setShowSuccessMsg(true);
      setSuccessMsg("Consultation saved successfully!");
      toast.success("Consultation saved successfully!");
      window.scrollTo(0, 0);
    };
    const onError = (errstatus) => {
      const msg = !(
        errstatus &&
        errstatus.data &&
        errstatus.data.apierror &&
        errstatus.data.apierror.message
      )
        ? "Something went wrong"
        : errstatus.data.apierror.message;
      setErrorMsg(msg);
      setShowErrorMsg(true);
      setShowLoading(false);
      window.scrollTo(0, 0);
      toast.error(msg);
    };
    props.createConsultation(data, onSuccess, onError);
  };

  const onChange = (e) => {
    e.persist();
    setconsult({ ...consult, [e.target.name]: e.target.value });
  };

  return (
    <React.Fragment>
      <ToastContainer />
    <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
    {errorMsg}
  </Alert>
  <Alert color="success" isOpen={showSuccessMsg} toggle={onDismissSuccess}>
    {successMsg}
  </Alert>
    <FormRenderer
    patientId={props.patient.patientId}
    formCode={currentForm.code}
    programCode={currentForm.programCode}
    visitId={props.patient.visitId}
    onSuccess={onSuccess}
  />
  </React.Fragment>
  )
  return (
    <form onSubmit={Saveconsult}>
      <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
        {errorMsg}
      </Alert>
      <Alert color="success" isOpen={showSuccessMsg} toggle={onDismissSuccess}>
        {successMsg}
      </Alert>
      <CardDeck>
        <PatientVitals
          height={props.height}
          getpatientdetails={props.getpatientdetails}
        />
        <PatientAllergies
          height={props.height}
          addstatus={true}
          patientAllergies={["Penicilin"]}
          setNewAllergy={setNewAllergy}
        />
      </CardDeck>
      <hr></hr>
     
      
      <CardDeck>
        <Card>
          <CardHeader> Presenting Complaints </CardHeader>
          <CardBody>
            <FormGroup>
              <Input
                type="textarea"
                name="consultation_notes"
                id="consultation_notes"
                style={{ height: "150px" }}
                value={consult.consultation_notes}
                onChange={onChange}
              />
            </FormGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader> Consultation Notes</CardHeader>
          <CardBody>
            <FormGroup>
              <Input
                type="textarea"
                name="present_consultation"
                id="present_consultation"
                style={{ height: "150px" }}
                value={consult.present_consultation}
                onChange={onChange}
              />
              <br></br>
            </FormGroup>
          </CardBody>
        </Card>
      </CardDeck>
      <hr></hr>
      <CardDeck>
        <Card>
          <CardHeader> Clinical Diagnosis </CardHeader>
          <CardBody>
            <div class="demo-search">
              Type for starting search:
              <input
                type="text"
                class="ctw-input"
                autoComplete="off"
                data-ctw-ino="1"
              />
            </div>
            <div class="ctw-window" data-ctw-ino="1"></div>
          </CardBody>
        </Card>
      </CardDeck>
      <br />

      {showLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}

      <MatButton
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
      >
        Save
      </MatButton>
    </form>
  );
}
const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    consultation: state.consultations.newConsultation,
  };
};

const mapActionToProps = {
  createConsultation: actions.create,
};

export default connect(mapStateToProps, mapActionToProps)(ConsultationPage);
