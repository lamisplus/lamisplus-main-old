import React, { useState } from "react";
import {Alert} from "reactstrap";
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
