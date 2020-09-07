import React, { useState } from "react";
import PatientList from "components/PatientSearch/ActivePatientSearch";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { FaCalendarPlus } from "react-icons/fa";
import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";
import FormRendererModal from "components/FormManager/FormRendererModal";

function NewAppointmentPage(props) {
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [currentForm, setCurrentForm] = useState(false);
    
    const onSuccess = () => {
        toast.success("Form saved successfully!", { appearance: "success" });
        setShowAppointmentForm(false);
      };
    
      const onError = () => {
        toast.error("Something went wrong, request failed.");
        setShowAppointmentForm(false);
      };
  const actionButton = {
    Action: (props) => (
      <IconButton
        color="primary"
        aria-label="Create Appointment"
        title="Create Appointment"
        onClick={(event) => {
                setCurrentForm({
                  code:CODES.APPOINTMENT_FORM,
                  programCode:CODES.GENERAL_SERVICE,
                  formName:"PATIENT APPOINTMENT",
                  patientId: props.data.patientId,
                  visitId: props.data.visitId,
                  options:{
                    modalSize: "modal-lg"
                  },
              });
              setShowAppointmentForm(true);
        }}
      >
        <FaCalendarPlus />
      </IconButton>
    ),
  };
  return (
  <>
   <ToastContainer />
  <PatientList actions={actionButton} />
  <FormRendererModal patientId={currentForm.patientId} visitId={currentForm.visitId} showModal={showAppointmentForm} setShowModal={setShowAppointmentForm} currentForm={currentForm} onSuccess={onSuccess} onError={onError} options={currentForm.options}/>
  </>
  );
}

function NewAppointmentButton() {
  const openAppointmentForm = () => {
    console.log("appt form opened");
  };

  return (
    <IconButton
      color="primary"
      aria-label="View Patient"
      title="View Patient"
      onClick={openAppointmentForm}
    >
      <FaCalendarPlus
        title="Create Appointment"
        aria-label="Create Appointment"
      />
    </IconButton>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(NewAppointmentPage);
