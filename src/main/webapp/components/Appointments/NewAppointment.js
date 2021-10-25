import React, { useState } from "react";
import PatientList from "components/PatientSearch/ActivePatientSearch";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { FaCalendarPlus } from "react-icons/fa";
import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";
import FormRendererModal from "components/FormManager/FormRendererModal";
import axios from "axios";
import {url as baseUrl} from "../../api";

import * as ACTION_TYPES from "../../actions/types";

function NewAppointmentPage(props) {
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [currentForm, setCurrentForm] = useState(false);
    //const [currentPatientId, setCurrentPatientId] = useState();
    let currentPatientId = null;
    const onSuccess = () => {
        toast.success("Form saved successfully!", { appearance: "success" });
        setShowAppointmentForm(false);
      };
    
      const onError = () => {
        toast.error("Something went wrong, request failed.");
        setShowAppointmentForm(false);
      };


    const saveAppointment = (submission) => {
        if(!currentPatientId){
            onError();
            return;
        }
        const data = {
            patientId: currentPatientId,
            detail: submission.data
        }
        axios
            .post(`${baseUrl}appointments`, data)
            .then(response => {
                    onSuccess();
            })
            .catch(error => {
                onError();
                }

            );
    }

  const actionButton = {
    Action: (props) => (
      <IconButton
        color="primary"
        aria-label="Create Appointment"
        title="Create Appointment"
        onClick={(event) => {

                currentPatientId = props.data.patientId;
               // setCurrentPatientId(props.data.patientId);
                setCurrentForm({
                  code:CODES.APPOINTMENT_FORM,
                  programCode:CODES.GENERAL_SERVICE,
                  formName:"PATIENT APPOINTMENT",
                  patientId: props.data.patientId,
                    patientHospitalNumber: props.data.id,
                  visitId: props.data.visitId,
                    onSubmit: saveAppointment,
                  options:{
                    modalSize: "modal-lg"
                  },
              });
              setShowAppointmentForm(true);
        }}>
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

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(NewAppointmentPage);
